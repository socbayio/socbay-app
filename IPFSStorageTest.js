//const {checkBlockAndUploadToCrust} = require('./routes/common')
const uploadBlock = require('./models/uploadBlockModel');
const global = require('./models/globalModel');
var config = require('./config');
const { spawn } = require('child_process');
var path = require('path');

/**
  MongooseDB
 */
const mongoose = require('mongoose');

console.log(config);
mongoose.connect(config.dbServerUrl + 'socbay', config.userAuth);
  
crustPrivateKey= "trial portion crucial caught word amused slot struggle need scissors polar curtainxx";


const crustPin = require('@crustio/crust-pin').default;
const crust = new crustPin(`${crustPrivateKey}`);

const {ApiPromise, WsProvider} = require('@polkadot/api') ;
const {typesBundleForPolkadot} = require('@crustio/type-definitions');


const checkBlockAndUploadToCrust = async()=>{
  const globalUploadBlockInfo = await global.findOne({variableName: "updateblock"});
  const currentBlock = await uploadBlock.findOne({blockNumber:globalUploadBlockInfo._doc.currentBlock})
  if (currentBlock.totalSizeInByte > 100) {
    console.log('start ---------------');
    // await crust.pin('QmQzNuEXeDwL7r6ZWuYoNLneP2T19gRQG3fcjro8UqHc2h'); //failed
    //const abc = await crust.pin('QmVzuGGkeK9FmLNXtUQVLVhTEKSqQvSUKNayCV6fkbq1Tz');
    //const abc = await crust.pin('QmPqizz12QPCVHXFHf1gKTyJcNELjG4FBog2cjEzHbH2YG');
    const abc = await crust.pin('QmQzNuEXeDwL7r6ZWuYoNLneP2T19gRQG3fcjro8UqHc2h');
    
    console.log('finish......');
    console.log(abc);
  }
}





const getStatus = async  () => {
    const api = new ApiPromise({
      provider: new WsProvider('wss://api.crust.network'),
      typesBundle: typesBundleForPolkadot,
    });
    await api.isReady;

    //const fileInfo = await api.query.market.files('QmPqizz12QPCVHXFHf1gKTyJcNELjG4FBog2cjEzHbH2YG');
    //const fileInfo = await api.query.market.files('QmQzNuEXeDwL7r6ZWuYoNLneP2T19gRQG3fcjro8UqHc2h');
    const fileInfo = await api.query.market.files('QmQyqzCeGzqfivN6ZwAVUDyLVrUNV93xpPtChp9VhbZjks');
    
    
    console.log(fileInfo.toHuman());
}

var loginCrustCLI = function(seed)
{
    return new Promise(function(resolve, reject){
        seed = '"'+ seed + '"';
        const login = spawn('crust-cli', ['login', seed],{shell: true});
        
        var mergeData = "";
        login.stdout.on('data', (data) => {
            mergeData+=data;
        });

        var mergeError = "";
        login.stderr.on('data', (data) => {
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
            mergeData+=data;
        });

        var mergeError = "";
        pin.stderr.on('data', (data) => {
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
            console.log(`stdout: ${data}`);
            mergeData+=data;
        });

        var mergeError = "";
        status.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
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

//checkBlockAndUploadToCrust();
//createNewBlock();
//getStatus();
let pathFile = path.resolve(__dirname,'middleware');

loginCrustCLI(crustPrivateKey).then((value)=>{
    console.log(`value ${value}`);
    pinByCrustCLI(pathFile).then((value)=>{
        console.log(value)
        publishByCrustCLI(value).then((value)=>{
            console.log('Finish')
            console.log(`value publish ${value}`)
        })
        .catch((e)=>{
            console.log('not finish');
            console.log(`error ${e}`)});
        checkStatusByCrustCLI(value);
    });
}).catch((e)=>{console.log(`error ${e}`)});

