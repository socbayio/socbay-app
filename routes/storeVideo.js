var express = require('express');
var router = express.Router();
const Video = require('../models/videoModel.js');
const liveChatVideo = require('../models/liveChatVideoModel');
var logger = require('../logger').Logger;

const {
    pushFileToMe,
    pushVideoToMe,
    pushVideoToTag, 
} = require('./common');

const {  
    uploadFile
} = require('../crust-socbay-pinner');

const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware');
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
    
    for ( var count = 0; count < req.files.file_data.length; count++ ){
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
        logger.error("There is hacker");
        return res.send({});
    }
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
            console.log(req.body)
            let thumbnailInfo = {};
            let videoInfo = await uploadFile(req.files.file_data[req.files.videoIndex], blockSizeLimitInByte);

            if (req.files.file_data.length == 2){
                thumbnailInfo = await uploadFile(req.files.file_data[req.files.thumbnailIndex], blockSizeLimitInByte);
            }
            let videoToUpload = {
                title: req.body.title,
                thumbnail: {
                    fileId: thumbnailInfo.fileId,
                    blockId: thumbnailInfo.blockId
                },
                lang: req.body.lang,
                ref: req.body.ref,
                description: req.body.desc,
                networkStatus: {
                    CID: videoInfo.CID,
                    //fileId: (await videoInfo).fileId, //consider to use that way to fasten the web
                    //blockId: (await videoInfo).blockId,
                    fileId: videoInfo.fileId,
                    blockId: videoInfo.blockId
                },
                authorId: req.userInfo.userId
            };

            const uploadedVideo = await Video.create(videoToUpload);
            await pushVideoToTag('newvideos', uploadedVideo._id, uploadedVideo.lang);
            await pushVideoToTag(req.body.tag, uploadedVideo._id, uploadedVideo.lang);
            await pushVideoToMe(req.userInfo.userId, uploadedVideo._id, uploadedVideo.lang);
            await pushFileToMe(req.userInfo.userId, videoInfo.fileId, videoInfo.blockId, uploadedVideo._id);
            await pushFileToMe(req.userInfo.userId, thumbnailInfo.fileId, thumbnailInfo.blockId, null);
            await createLiveChatForVideo(uploadedVideo._id);

        } catch (e) {
            logger.error(`Error in storeVideo.js: ${e}`);
        }
    }
);

module.exports = router;
