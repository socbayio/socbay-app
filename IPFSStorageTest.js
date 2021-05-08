//const {checkBlockAndUploadToCrust} = require('./routes/common')
const uploadBlock = require('./models/uploadBlockModel');
const globalConfig = require('./models/globalConfigModel');
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

//checkBlockAndUploadToCrust();
//createNewBlock();
//getStatus();
let pathFile = path.resolve(__dirname,'middleware');
// loginCrustCLI(crustPrivateKey).then((value)=>{
//     console.log(`value ${value}`);
//     pinByCrustCLI(pathFile).then((value)=>{
//         console.log(value)
//         publishByCrustCLI(value).then((value)=>{
//             console.log('Finish')
//             console.log(`value publish ${value}`)
//         })
//         .catch((e)=>{
//             console.log('not finish');
//             console.log(`error ${e}`)});
//         checkStatusByCrustCLI(value);
//     });
// }).catch((e)=>{console.log(`error ${e}`)});





// var logger = require("./logger").Logger;
 const {  getStatusByCrustJs } = require('./crust-socbay-pinner')
// console.log('start.....')
// console.log(`start ${crustPrivateKey} ${pathFile}`)
// checkBlockAndUploadToCrust(crustPrivateKey,pathFile)
// .then(()=>{
//         console.log('finish');
// })
// .catch((e)=>{
//     logger.crustSocbayPinner(`----- FINISH PINNING BLOCK WITHOUT DIRECT SUCCESS -----`);
// });

getStatusByCrustJs('QmSFkfspLXYB7JiZq7bwxTaBNZJcZBUjDVhFb6J5RcDGHx').then((value)=>{console.log(value)})