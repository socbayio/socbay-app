var express = require('express');
var router = express.Router();
const { getVideoDurationInSeconds } = require('get-video-duration');
const Video = require('../models/videoModel.js');
const User = require('../models/userModel.js');
const videoTag = require('../models/videoTagModel.js');
const liveChatVideo = require('../models/liveChatVideoModel');
var path = require('path');
const config = require("../config.js");

const { addFileInfo, addFileToIPFSPromise, pushFileToMe } = require('./common');
const { pushVideoToTag, pushVideoToMe } = require('./common');

const { 
    checkBlockAndUploadToCrust, 
    uploadBlockToCrust, 
    createNewBlock 
} = require('../crust-socbay-pinner');

const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware');
const verificationUpload = require('../middleware/verificationUpload');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');


const createLiveChatForVideo = async (videoId) => {
    await liveChatVideo.create({ videoId: videoId });
};

const thumbnailDictionary = {
    gaming: '/images/thumbnails/default/gaming.jpg',
    tech: '/images/thumbnails/default/tech.jpg',
    finance: '/images/thumbnails/default/finance.jpg',
    cryptonews: '/images/thumbnails/default/crypto.jpg',
    news: '/images/thumbnails/default/news.jpg',
    lifestyle: '/images/thumbnails/default/lifestyle.jpg',
    healthandfitness: '/images/thumbnails/default/healthandfitness.jpg',
    music: '/images/thumbnails/default/notselected.jpg',
    default: '/images/thumbnails/default/notselected.jpg',
};

const filesValidation = async (req, res, next) => {
    let fileList = [];
    if (!Array.isArray(req.files.file_data)){
        req.files.file_data = [req.files.file_data];
        req.files.videoIndex = 0;
    }
    var validatedVideo = 0;
    var wrongFile = false;
    
    for (var count = 0; count < req.files.file_data.length; count++){
        if (req.files.file_data[count].mimetype.includes("video")){
            validatedVideo++;
            req.files.videoIndex = count;
        } else {
            req.files.thumbnailIndex = count;
        }
        if (!(req.files.file_data[count].mimetype.includes("video")||req.files.file_data[count].mimetype.includes("image"))){
            wrongFile = true;
        }
    }
    if ((validatedVideo == 1)&&(!wrongFile)&&(req.files.file_data.length<3)){
        next();
    } else {
        //TODO: Log this case and return error
        console.error("There is hacker");
        return res.send({});
    }
}

/***************************************************************************/
//@brief        Choose the storage block for each file, use global variable 
//              for fast access to to its value          
//@param[in]    file input from krajee fileinput, the sizeLimitInByte of block
//@returns      path to save the file, block of file
/***************************************************************************/
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
    pathFile = path.resolve(
        __dirname,
        '..',
        'public/block',
        localCurrentBlock.blockNumber.toString(),
        file.name
    ); 
    return {pathFile, block: localCurrentBlock}
}

/***************************************************************************/
//@brief        Upload file to block, if block reaches its limit, upload to
//              Crust   
//@param[in]    file input from krajee fileinput, the sizeLimitInByte of block
//@returns      
/***************************************************************************/
const uploadFile = async (file, sizeLimitInByte) => {
    var fileStorageInfo = chooseStorageBlock(file, sizeLimitInByte);
    await file.mv(fileStorageInfo.pathFile);
    const output = await addFileToIPFSPromise(fileStorageInfo.pathFile);
    const fileInfo = await addFileInfo(
        fileStorageInfo.block.blockNumber,
        file.name, 
        file.size,
        output
    );
    if ( fileStorageInfo.block.totalSize + file.size > sizeLimitInByte){
        uploadBlockToCrust(
            config.crustPrivateKey,
            fileStorageInfo.block.blockNumber
        );
    }
    fileInfo.CID = output;
    return fileInfo;
}

router.post(
    '/',
    redirectIfNotAuthenticatedMiddleware,
    getInfoIfAuthenticated,
    filesValidation,
    async (req, res, next) => {
        const blockSizeLimitInByte = 100*1024*1024;
        res.send({})
        try {
            let thumbnailInfo = {};
            let videoInfo = await uploadFile(req.files.file_data[req.files.videoIndex], blockSizeLimitInByte);

            if (req.files.file_data.length == 2){
                thumbnailInfo = await uploadFile(req.files.file_data[req.files.thumbnailIndex], blockSizeLimitInByte);
            }
            let videoToUpload = {
                title: req.body.title,
                thumbnail: thumbnailInfo.CID,
                lang: req.body.lang,
                description: req.body.desc,
                //durationInSecond:
                networkStatus: {
                    CID: videoInfo.CID,
                    //fileId: (await videoInfo).fileId,
                    //blockId: (await videoInfo).blockId,
                    fileId: videoInfo.fileId,
                    blockId: videoInfo.blockId
                },
                authorId: req.userInfo.userId
            };

            // await getVideoDurationInSeconds('https://ipfs.io/ipfs/' + videoInfo.CID)
            // .then((duration) => {
            //     fileToUpload.durationInSecond = duration;
            //     fileToUpload.fileUploadStatus = 'Successful';
            // })
            // .catch((error) => {console.error(error)});

            const uploadedVideo = await Video.create(videoToUpload);
            await pushVideoToTag('newvideos', uploadedVideo._id, uploadedVideo.lang);
            await pushVideoToTag(req.body.tag, uploadedVideo._id, uploadedVideo.lang);
            await pushVideoToMe(req.userInfo.userId, uploadedVideo._id, uploadedVideo.lang);
            await pushFileToMe(req.userInfo.userId, videoInfo.fileId, videoInfo.blockId, uploadedVideo._id);
            await pushFileToMe(req.userInfo.userId, thumbnailInfo.fileId, thumbnailInfo.blockId, null);
            await createLiveChatForVideo(uploadedVideo._id);

        } catch (e) {
            console.log(e)
        }
    }
);

module.exports = router;
