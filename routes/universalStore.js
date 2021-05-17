var express = require('express');
var router = express.Router();
var path = require('path');
const { addFileInfo, addFileToIPFSPromise } = require('./common');
const {  
    uploadBlockToCrust, 
    createNewBlock 
} = require('../crust-socbay-pinner');
var logger = require("../logger").Logger;
const config = require("../config.js");
const pin = require('../crust-ipfs/pin').default;

const chooseStorageBlock = (file, sizeLimitInByte) => {
    let localCurrentBlock = {
        totalSize: globalCurrentBlock.totalSize,
        blockNumber: globalCurrentBlock.blockNumber
    };
    globalCurrentBlock.totalSize += file.size;
    if (globalCurrentBlock.totalSize > sizeLimitInByte){
        globalCurrentBlock.blockNumber++;
        globalCurrentBlock.totalSize = 0;
        createNewBlock();
    }
    return path.resolve(
        __dirname,
        '..',
        'public/block',
        localCurrentBlock.blockNumber.toString(),
        file.name
    ); 
}

router.post('/', async function (req, res, next) {
    try {
        let file = req.files.file_data;
        let localCurrentBlock = {
            totalSize: globalCurrentBlock.totalSize,
            blockNumber: globalCurrentBlock.blockNumber
        };
        globalCurrentBlock.totalSize += file.size;
        if (globalCurrentBlock.totalSize > 100*1024*1024){
            globalCurrentBlock.blockNumber++;
            globalCurrentBlock.totalSize = 0;
            createNewBlock();
        }
        let pathFile = path.resolve(
            __dirname,
            '..',
            'public/block',
            localCurrentBlock.blockNumber.toString(),
            file.name
        );
        await file.mv(pathFile);
        const pinnedFile = await pin(pathFile);
        addFileInfo(
            localCurrentBlock.blockNumber,
            file.name,
            pinnedFile.fileSize,
            pinnedFile.cid
        );
        if ( localCurrentBlock.totalSize + file.size > 100*1024*1024){
            uploadBlockToCrust(
                config.crustPrivateKey,
                localCurrentBlock.blockNumber
            );
        }

        res.send({CID: pinnedFile.cid});
        res.end();
    } catch (e) {
        //Rework error catching
        console.error(`UniversalStore page fail with error: ${e}`);
        next(e);
    }
});

module.exports = router;
