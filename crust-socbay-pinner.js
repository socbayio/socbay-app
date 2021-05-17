const { uploadBlock } = require('./models/uploadBlockModel');
const globalConfig = require('./models/globalConfigModel');
var config = require('./config');
var path = require('path');
var logger = require('./logger').Logger;

const pin = require('./crust-ipfs/pin.js').default;
const publish = require('./crust-ipfs/publish.js').default;

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
    const pinnedFolder = await pin(pathFolderToUpload);
    await uploadBlock.findOneAndUpdate({blockNumber},{CID: pinnedFolder.cid, timeStamp:Date.now()});
    await publish(seed, pinnedFolder.cid, 0.00);

    logger.crustSocbayPinner(`----- FINISH SUCCESSFULLY PINNING BLOCK ${blockNumber} -----`);
  } catch (e) {
    logger.crustSocbayPinner(`----- FINISH PINNING BLOCK ${blockNumber} WITH ERROR ${e} -----`);
  }
}

module.exports = { 
  createNewBlock,
  uploadBlockToCrust
};