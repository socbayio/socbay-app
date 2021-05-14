var express = require('express');
var router = express.Router();
const { getVideoDurationInSeconds } = require('get-video-duration');
const Video = require('../models/videoModel.js');
const User = require('../models/userModel.js');
const videoTag = require('../models/videoTagModel.js');
const liveChatVideo = require('../models/liveChatVideoModel');
var path = require('path');
const config = require("../config.js");

const { addFileInfo, addFileToIPFSPromise } = require('./common');
const { 
    checkBlockAndUploadToCrust, 
    uploadBlockToCrust, 
    createNewBlock 
} = require('../crust-socbay-pinner');

const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware');
const verificationUpload = require('../middleware/verificationUpload');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');

const { pushVideoToTag, pushVideoToMe } = require('./common');

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
    }
    var validatedVideo = 0;
    var wrongFile = false;
    for (var count = 0; count < req.files.file_data.length; count++){
        if (req.files.file_data[count].mimetype.includes("video")){
            validatedVideo++;
        }
        if (!(req.files.file_data[count].mimetype.includes("video")||req.files.file_data[count].mimetype.includes("image"))){
            wrongFile = true;
        }
    }
    if ((validatedVideo == 1)&&(!wrongFile)){
        next();
    } else {
        //TODO: Log this case and return error
        console.error("There is hacker");
        return res.send({});
    }
}

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
    return {pathFile, localCurrentBlock}
}

router.post(
    '/',
    //redirectIfNotAuthenticatedMiddleware,
    getInfoIfAuthenticated,
    filesValidation,
    async (req, res, next) => {
        res.send({})
        try {

            for (var fileCount = 0; fileCount < req.files.file_data.length; fileCount++){
                var fileStorageInfo = chooseStorageBlock(req.files.file_data[fileCount], 100*1024*1024);
                await req.files.file_data[fileCount].mv(fileStorageInfo.pathFile);
                const output = await addFileToIPFSPromise(fileStorageInfo.pathFile);
                addFileInfo(
                    fileStorageInfo.localCurrentBlock.blockNumber,
                    req.files.file_data[fileCount].name, 
                    req.files.file_data[fileCount].size,
                    output
                );
                if ( fileStorageInfo.localCurrentBlock.totalSize + req.files.file_data[fileCount].size > 100*1024*1024){
                    uploadBlockToCrust(
                        config.crustPrivateKey,
                        fileStorageInfo.localCurrentBlock.blockNumber
                    );
                }
            }
        } catch (e) {

        }
/*         res.redirect('/');
        let fileToUpload = req.body;
        if (req.files && req.files.thumbnail) {
            let image = req.files.thumbnail;
            await image.mv(
                path.resolve(
                    __dirname,
                    '..',
                    'public/images/thumbnails',
                    image.name
                )
            ); //, (error)=>{}
            fileToUpload.thumbnail = '/images/thumbnails/' + image.name;
            let chooseDefaultImage = false; // TODO: when uploading fail -> chooseDefaultImage = true
        }

        if (!(req.files && req.files.thumbnail) || chooseDefaultImage) {
            if (req.body.tag in thumbnailDictionary) {
                fileToUpload.thumbnail = thumbnailDictionary[req.body.tag];
            } else {
                fileToUpload.thumbnail = thumbnailDictionary['default'];
            }
        }

        fileToUpload.authorId = req.userInfo.userId;
        fileToUpload.networkStatus = {
            CID: req.body.CID,
            networkName: 'local',
        };

        await getVideoDurationInSeconds('https://ipfs.io/ipfs/' + req.body.CID)
            .then((duration) => {
                fileToUpload.durationInSecond = duration;
                fileToUpload.fileUploadStatus = 'Successful';
            })
            .catch((error) => {});

        const uploadedVideo = await Video.create(fileToUpload);

        if (uploadedVideo._id) {
            await pushVideoToTag('newvideos', uploadedVideo._id, uploadedVideo.lang);
            await pushVideoToTag(req.body.tag, uploadedVideo._id, uploadedVideo.lang);
            await pushVideoToMe(req.userInfo.userId, uploadedVideo._id, uploadedVideo.lang);
            await createLiveChatForVideo(uploadedVideo._id);
        }
        return; */
    }
);

module.exports = router;
