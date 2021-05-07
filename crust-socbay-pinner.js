const uploadBlock = require('./models/uploadBlockModel');
const global = require('./models/globalModel');
var config = require('./config');
const { spawn } = require('child_process');
var path = require('path');

const {ApiPromise, WsProvider} = require('@polkadot/api') ;
const {typesBundleForPolkadot} = require('@crustio/type-definitions');




/* Crust CLI */
var loginCrustCLI = function(seed)
{
  return new Promise(function(resolve, reject){
    seed = '"'+ seed + '"';
    const login = spawn('crust-cli', ['login', seed],{shell: true});
    
    var mergeData = "";
    login.stdout.on('data', (data) => {
      console.log(`login_stdout: ${data}`)
      mergeData+=data;
    });

    var mergeError = "";
    login.stderr.on('data', (data) => {
      console.log(`login_stderr: ${data}`)
      mergeError+=data;
    });

    login.on('close', (code) => {
      if (code==0){  
        if (mergeData == "Login success!\n"){
          resolve();
        }
        else {
          reject(mergeData + mergeError);
        }
      } else {
        reject(mergeError);
      } 
    });
  });
}

var pinByCrustCLI = function(path)
{
  return new Promise(function(resolve, reject){
    path = '"'+path+'"';
    const pin = spawn('crust-cli', ['pin', path],{shell: true});
    
    var mergeData = "";
    pin.stdout.on('data', (data) => {
      console.log(`pin_stdout: ${data}`)
      mergeData+=data;
    });

    var mergeError = "";
    pin.stderr.on('data', (data) => {
      console.log(`login_stderr: ${data}`)
      mergeError+=data;
    });

    pin.on('close', (code) => {
      if (code==0){  
        var searchCID = mergeData.match(/Pin\ssuccess:\s([a-zA-Z0-9]*)\n/);
        if (searchCID[1]){
          resolve(searchCID[1]);
        }
        else {
          reject(mergeData + mergeError);
        }
      } else {
        reject(mergeError);
      }
    });
  });
}

var publishByCrustCLI = function(CID) {
  return new Promise(function(resolve, reject){
    const timer = setTimeout(() => {
      console.log(`Publish Sdtout: ${mergeData}`);
      console.log(`Publish Stderr: ${mergeError}`);
      reject(new Error(`publishByCrustCLI promise timed out after 30s`));
    }, 30000);
    
    const publish = spawn('crust-cli', ['publish', CID],{shell: true});
    
    var mergeData = "";
    publish.stdout.on('data', (data) => {
      mergeData+=data;
    });

    var mergeError = "";
    publish.stderr.on('data', (data) => {
      mergeError+=data;
    });
    
    publish.on('close', (code) => {
      if (code==0){  
        clearTimeout(timer);
        resolve(mergeData);
      } else {
        clearTimeout(timer);
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

const checkBlockAndUploadToCrust = async()=>{
  const updateBlock = await global.findOne({variableName: "updateblock"});
  const currentBlock = await uploadBlock.findOne({blockNumber:updateBlock._doc.currentBlock})
  if (currentBlock.totalSizeInByte > 100*1024*1024) {
       
  }
}

module.exports = { };