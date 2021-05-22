const { uploadBlock } = require('./models/uploadBlockModel');
const globalConfig = require('./models/globalConfigModel');
var config = require('./config');
var path = require('path');
var logger = require('./logger').Logger;

const { addFileInfo,
    pushFileToMe,
    pushVideoToMe,
    pushVideoToTag,
    
} = require('./routes/common');


const pin = require('./crust-ipfs/pin.js').default;
const publish = require('./crust-ipfs/publish.js').default;

const createNewBlock = async ()=>{
    const globalUploadBlockInfo = await globalConfig.findOneAndUpdate(
        {variableName: "updateblock"},
        {
            $inc:{'currentBlock': 1},
            filesNumber: 0,
            totalSizeInByte: 0
        }
    );
    await uploadBlock.create({
        blockNumber: globalUploadBlockInfo._doc.currentBlock+1
    });
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

/**
 * @brief Choose the storage block for each file, use global variable 
 *        for fast accessing to to its value
 * @param file input from krajee fileinput
 * @param sizeLimitInByte of block
 * @return path to save the file, block of file
 */
 const chooseStorageBlock = (file, sizeLimitInByte) => {
    let localCurrentBlock = {
        totalSize: globalCurrentBlock.totalSizeInByte,
        blockNumber: globalCurrentBlock.blockNumber,
        filesNumber: globalCurrentBlock.filesNumber
    };
    globalCurrentBlock.totalSizeInByte += file.size;
    globalCurrentBlock.filesNumber++;

    globalConfig.findOneAndUpdate(
        {variableName: "updateblock"},
        {
            $inc:
                {
                    'filesNumber': 1, 
                    'totalSizeInByte': file.size
                }
        }
    ).then();

    if (globalCurrentBlock.totalSizeInByte > sizeLimitInByte){
        globalCurrentBlock.blockNumber++;
        globalCurrentBlock.totalSizeInByte = 0;
        globalCurrentBlock.filesNumber = 0;
        createNewBlock();
    }
    let extension = file.name.split('.').pop();
    let fileName = '_'+ (localCurrentBlock.filesNumber+1).toString() + '.' + extension;
    let tempFileName = file.name.substring(0, file.name.length - extension.length - 1);
    fileName = tempFileName.substring(0, 16 - fileName.length) + fileName;
    pathFile = path.resolve(
        __dirname,
        'public/block',
        localCurrentBlock.blockNumber.toString(),
        fileName
    );
    return { pathFile, block: localCurrentBlock, fileName }
}

/**
 * @brief Upload file to block, if block reaches its limit, upload to Crust
 * @param file input from krajee fileinput
 * @param sizeLimitInByte of block
 * @return fileInfo
 */
 const uploadFile = async (file, sizeLimitInByte) => {
    const fileStorageInfo = chooseStorageBlock(file, sizeLimitInByte);
    await file.mv(fileStorageInfo.pathFile);
    const pinnedFile = await pin(fileStorageInfo.pathFile);
    const fileInfo = await addFileInfo(
        fileStorageInfo.block.blockNumber,
        fileStorageInfo.fileName, 
        pinnedFile.fileSize,
        pinnedFile.cid
    );
    if ( fileStorageInfo.block.totalSize + file.size > sizeLimitInByte){
        const pathFolderToUpload = path.resolve(__dirname, 'public/block', fileStorageInfo.block.blockNumber.toString());
        const pinnedFolder = await pin(pathFolderToUpload);
        await uploadBlock.findOneAndUpdate(
            { blockNumber: fileStorageInfo.block.blockNumber },
            { CID: pinnedFolder.cid,
                timeStamp: Date.now()
            }
        );
        publish(config.crustPrivateKey, pinnedFolder.cid, 0.00);
    }
    fileInfo.CID = pinnedFile.cid;
    return fileInfo;
}

module.exports = { 
  createNewBlock,
  uploadBlockToCrust,
  chooseStorageBlock,
  uploadFile
};