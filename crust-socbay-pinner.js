const uploadBlock = require('./models/uploadBlockModel');
const global = require('./models/globalModel');
var config = require('./config');
const { spawn } = require('child_process');
var path = require('path');
var logger = require("./logger").Logger;

const {ApiPromise, WsProvider} = require('@polkadot/api') ;
const {typesBundleForPolkadot} = require('@crustio/type-definitions');

/* Crust CLI */
var loginCrustCLI = function(seed)
{
  return new Promise(function(resolve, reject){
    logger.crustSocbayPinner('Start Logging');
    seed = '"'+ seed + '"';
    const login = spawn('crust-cli', ['login', seed],{shell: true});
    
    var mergeData = "";
    login.stdout.on('data', (data) => {
      logger.crustSocbayPinner(`Stdout: ${data.toString().trimEnd()}`);
      mergeData+=data;
    });

    var mergeError = "";
    login.stderr.on('data', (data) => {
      logger.crustSocbayPinner(`Stderr: ${data.toString().trimEnd()}`);
      mergeError+=data;
    });

    login.on('close', (code) => {
      if (code==0){  
        if (mergeData == "Login success!\n"){
          logger.crustSocbayPinner('Close Code: 0. Exit successfully! Login success!');
          resolve();
        }
        else {
          logger.crustSocbayPinner('Close Code: 0. Exit failed! Login failed!');
          reject(mergeData + mergeError);
        }
      } else {
        logger.crustSocbayPinner(`Close code: ${code}. Exit failed!`);
        reject(mergeError);
      } 
    });
  });
}

var pinByCrustCLI = function(path)
{
  return new Promise(function(resolve, reject){
    logger.crustSocbayPinner(`Pinning Started: ${path}`);
    path = '"'+path+'"';
    const pin = spawn('crust-cli', ['pin', path],{shell: true});
    var mergeData = "";
    pin.stdout.on('data', (data) => {
      logger.crustSocbayPinner(`Stdout: ${data.toString().trimEnd()}`);
      mergeData+=data;
    });

    var mergeError = "";
    pin.stderr.on('data', (data) => {
      logger.crustSocbayPinner(`Stderr: ${data.toString().trimEnd()}`);
      mergeError+=data;
    });

    pin.on('close', (code) => {
      if (code==0){
        var searchCID = mergeData.match(/Pin\ssuccess:\s([a-zA-Z0-9]*)\n/);
        if (searchCID[1]){
          logger.crustSocbayPinner(`Close Code:0. Exit successfully! Pattern matches, CID found: ${searchCID[1]}`);
          resolve(searchCID[1]);
        }
        else {
          logger.crustSocbayPinner("Close Code: 0. Exit failed! Pattern doesn't match:");
          logger.crustSocbayPinner(`mergeData: ${mergeData}`);
          logger.crustSocbayPinner(`searchCID: ${searchCID}`);
          reject(mergeData + mergeError);
        }
      } else {
        logger.crustSocbayPinner(`Close Code: ${code}. Exit failed!`);
        logger.crustSocbayPinner(`mergeError: ${mergeError}`);
        reject(mergeError);
      }
    });
  });
}

var publishByCrustCLI = function(CID) {
  return new Promise(function(resolve, reject){
    logger.crustSocbayPinner(`Publishing Started: ${CID}`);
    const timer = setTimeout(() => {
      logger.crustSocbayPinner("Exit failed! Timeout after 30s!");
      reject(new Error(`Timed out after 30s`));
    }, 30000);
    
    const publish = spawn('crust-cli', ['publish', CID],{shell: true});
    
    var mergeData = "";
    publish.stdout.on('data', (data) => {
      logger.crustSocbayPinner(`Stdout: ${data.toString().trimEnd()}`);
      mergeData+=data;
    });

    var mergeError = "";
    publish.stderr.on('data', (data) => {
      logger.crustSocbayPinner(`Stderr: ${data.toString().trimEnd()}`);
      mergeError+=data;
    });
    
    publish.on('close', (code) => {
      if (code==0){  
        clearTimeout(timer);
        logger.crustSocbayPinner("Close Code: 0. Exit successfully!");
        resolve(mergeData);
      } else {
        clearTimeout(timer);
        logger.crustSocbayPinner(`Close Code: ${code}. Exit failed!`);
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

const createNewBlock = async ()=>{
  const globalUploadBlockInfo = await global.findOneAndUpdate({variableName: "updateblock"},{$inc:{'currentBlock':1}});
  await uploadBlock.create({blockNumber:globalUploadBlockInfo._doc.currentBlock+1});
}

const checkBlockAndUploadToCrust = async(seed,path)=>{
  const updateBlock = await global.findOne({variableName: "updateblock"});
  const currentBlock = await uploadBlock.findOne({blockNumber:updateBlock._doc.currentBlock})
  if (currentBlock.totalSizeInByte > 100) {
    await loginCrustCLI(seed);
    const pinCID = await pinByCrustCLI(path);
    publishByCrustCLI(pinCID).then(

    )
    .catch((e)=>{
      console.error(`Publish by Crust-CLI error: ${e}`);
    });
  }
}

module.exports = { checkBlockAndUploadToCrust };