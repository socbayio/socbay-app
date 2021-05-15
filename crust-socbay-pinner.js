const { uploadBlock } = require('./models/uploadBlockModel');
const globalConfig = require('./models/globalConfigModel');
var config = require('./config');
const { spawn } = require('child_process');
var path = require('path');
var logger = require("./logger").Logger;

/* Crust JS */
const {ApiPromise, WsProvider} = require('@polkadot/api') ;
const {typesBundleForPolkadot} = require('@crustio/type-definitions');

/* Crust CLI */
var loginCrustCLI = function(seed, blockNumber)
{
  return new Promise(function(resolve, reject){
    logger.crustSocbayPinner(`[Block ${blockNumber}] Start Logging`);
    seed = '"'+ seed + '"';
    const login = spawn('crust-cli', ['login', seed],{shell: true});
    
    var mergeData = "";
    login.stdout.on('data', (data) => {
      logger.crustSocbayPinner(`[Block ${blockNumber}] Stdout: ${data.toString().trimEnd()}`);
      mergeData+=data;
    });

    var mergeError = "";
    login.stderr.on('data', (data) => {
      logger.crustSocbayPinner(`[Block ${blockNumber}] Stderr: ${data.toString().trimEnd()}`);
      mergeError+=data;
    });

    login.on('close', (code) => {
      if (code==0){  
        if (mergeData == "Login success!\n"){
          logger.crustSocbayPinner(`[Block ${blockNumber}] Close Code: 0. Exit successfully! Login success!`);
          resolve();
        }
        else {
          logger.crustSocbayPinner(`[Block ${blockNumber}] Close Code: 0. Exit failed! Login failed!`);
          reject(mergeData + mergeError);
        }
      } else {
        logger.crustSocbayPinner(`[Block ${blockNumber}] Close code: ${code}. Exit failed!`);
        reject(mergeError);
      } 
    });
  });
}

var pinByCrustCLI = function(path, blockNumber)
{
  return new Promise(function(resolve, reject){
    logger.crustSocbayPinner(`[Block ${blockNumber}] Pinning Started: ${path}`);
    path = '"'+path+'"';
    const pin = spawn('crust-cli', ['pin', path],{shell: true});
    var mergeData = "";
    pin.stdout.on('data', (data) => {
      logger.crustSocbayPinner(`[Block ${blockNumber}] Stdout: ${data.toString().trimEnd()}`);
      mergeData+=data;
    });

    var mergeError = "";
    pin.stderr.on('data', (data) => {
      logger.crustSocbayPinner(`[Block ${blockNumber}] Stderr: ${data.toString().trimEnd()}`);
      mergeError+=data;
    });

    pin.on('close', (code) => {
      if (code==0){
        var searchCID = mergeData.match(/Pin\ssuccess:\s([a-zA-Z0-9]*)\n/);
        if (searchCID[1]){
          logger.crustSocbayPinner(`[Block ${blockNumber}] Close Code:0. Exit successfully! Pattern matches, CID found: ${searchCID[1]}`);
          resolve(searchCID[1]);
        }
        else {
          logger.crustSocbayPinner(`[Block ${blockNumber}] Close Code: 0. Exit failed! Pattern doesn't match:`);
          logger.crustSocbayPinner(`mergeData: ${mergeData}`);
          logger.crustSocbayPinner(`searchCID: ${searchCID}`);
          reject(mergeData + mergeError);
        }
      } else {
        logger.crustSocbayPinner(`[Block ${blockNumber}] Close Code: ${code}. Exit failed!`);
        logger.crustSocbayPinner(`mergeError: ${mergeError}`);
        reject(mergeError);
      }
    });
  });
}

var publishByCrustCLI = function(CID, blockNumber) {
  return new Promise(function(resolve, reject){
    logger.crustSocbayPinner(`[Block ${blockNumber}] Publishing Started: ${CID}`);
    const timer = setTimeout(() => {
      logger.crustSocbayPinner(`[Block ${blockNumber}] Exit failed! Timeout after 60s!`);
      reject(new Error(`Timed out after 60s`));
    }, 60000);
    
    const publish = spawn('crust-cli', ['publish', CID],{shell: true});
    
    var mergeData = "";
    publish.stdout.on('data', (data) => {
      logger.crustSocbayPinner(`[Block ${blockNumber}] Stdout: ${data.toString().trimEnd()}`);
      mergeData+=data;
    });

    var mergeError = "";
    publish.stderr.on('data', (data) => {
      logger.crustSocbayPinner(`[Block ${blockNumber}] Stderr: ${data.toString().trimEnd()}`);
      mergeError+=data;
    });
    
    publish.on('close', (code) => {
      if (code==0){  
        clearTimeout(timer);
        logger.crustSocbayPinner(`[Block ${blockNumber}] Close Code: 0. Exit successfully!`);
        resolve(mergeData);
      } else {
        clearTimeout(timer);
        logger.crustSocbayPinner(`[Block ${blockNumber}] Close Code: ${code}. Exit failed!`);
        reject(mergeError);
      }
    });
  });
}

var checkStatusByCrustCLI = function(CID)
{
  return new Promise(function(resolve, reject){
    path = '"'+path+'"';
    const status = spawn('crust-cli', ['status', CID],{shell: true});
    
    var mergeData = "";
    status.stdout.on('data', (data) => {
      console.log(`status_stdout: ${data}`);
      mergeData+=data;
    });

    var mergeError = "";
    status.stderr.on('data', (data) => {
      console.log(`status_stderr: ${data}`);
      mergeError+=data;
    });

    status.on('close', (code) => {
      if (code==0){  
        resolve(mergeData);
      } else {
        reject(mergeError);
      }
    });
  });
}

const getStatusByCrustJs = async (CID) => {
  const api = new ApiPromise({
    provider: new WsProvider('wss://api.crust.network'),
    typesBundle: typesBundleForPolkadot,
  });
  await api.isReady;
  const fileInfo = await api.query.market.files(CID);
  return (fileInfo.toHuman());
}

const createNewBlock = async ()=>{
  const globalUploadBlockInfo = await globalConfig.findOneAndUpdate(
    {variableName: "updateblock"},
    {$inc:{'currentBlock':1}}
  );
  await uploadBlock.create({blockNumber:globalUploadBlockInfo._doc.currentBlock+1});
}

const uploadBlockToCrust = async(seed,blockNumber)=>{
  try {
    let pathFolderToUpload = path.resolve(__dirname,'public/block',blockNumber.toString());
    logger.crustSocbayPinner(`----- START PINNING BLOCK ${blockNumber} -----`);
    await loginCrustCLI(seed,blockNumber);
    const pinCID = await pinByCrustCLI(pathFolderToUpload,blockNumber);
    await uploadBlock.findOneAndUpdate({blockNumber},{CID:pinCID, timeStamp:Date.now()});
    await publishByCrustCLI(pinCID,blockNumber);
    logger.crustSocbayPinner(`----- FINISH SUCCESSFULLY PINNING BLOCK ${blockNumber} -----`);
  } catch (e) {
    logger.crustSocbayPinner(`----- FINISH PINNING BLOCK ${blockNumber} WITH ERROR ${e} -----`);
  }
}

module.exports = { 
  loginCrustCLI,
  pinByCrustCLI,
  publishByCrustCLI,
  checkStatusByCrustCLI,
  getStatusByCrustJs,
  createNewBlock,
  uploadBlockToCrust
};