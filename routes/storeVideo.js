const express = require('express');

const router = express.Router();
const Video = require('../models/videoModel');
const liveChatVideo = require('../models/liveChatVideoModel');
const logger = require('../logger').Logger;
const config = require('../config');

const { pushFileToMe, pushVideoToMe, pushVideoToTag } = require('./common');

const { uploadFile } = require('../crust-socbay-pinner');

const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated');

const createLiveChatForVideo = async (videoId) => {
    await liveChatVideo.create({ videoId });
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
    try {
        if (!Array.isArray(req.files.file_data)) {
            req.files.file_data = [req.files.file_data];
            req.files.videoIndex = 0;
        }
        let validatedVideo = 0;
        let validatedImage = 0;

        for (let count = 0; count < req.files.file_data.length; count++) {
            if (req.files.file_data[count].mimetype.includes('video')) {
                validatedVideo++;
                req.files.videoIndex = count;
            }
            if (req.files.file_data[count].mimetype.includes('image')) {
                validatedImage++;
                req.files.thumbnailIndex = count;
            }
        }
        if (
            validatedVideo == 1 &&
            validatedImage == 1 &&
            req.files.file_data.length == 2
        ) {
            next();
        } else {
            // TODO: Log this case and return error
            logger.error('There is hacker');
            return res.send({});
        }
    } catch (e) {
        logger.error(`Storevideo error ${e}`);
        next();
    }
};

router.post(
    '/',
    redirectIfNotAuthenticatedMiddleware,
    getInfoIfAuthenticated,
    filesValidation,
    async (req, res, next) => {
        res.send({});
        try {
            const thumbnailInfo = await uploadFile(
                req.files.file_data[req.files.thumbnailIndex],
                config.blockSizeLimitInByte
            );
            const videoInfo = await uploadFile(
                req.files.file_data[req.files.videoIndex],
                config.blockSizeLimitInByte
            );
            const videoToUpload = {
                title: req.body.title,
                thumbnail: {
                    fileId: thumbnailInfo.fileId,
                    blockId: thumbnailInfo.blockId,
                },
                lang: req.body.lang,
                ref: req.body.ref,
                description: req.body.desc,
                networkStatus: {
                    CID: videoInfo.CID,
                    // fileId: (await videoInfo).fileId, //consider to use that way to fasten the web
                    // blockId: (await videoInfo).blockId,
                    fileId: videoInfo.fileId,
                    blockId: videoInfo.blockId,
                },
                authorId: req.userInfo.userId,
            };

            const uploadedVideo = await Video.create(videoToUpload);
            await pushVideoToTag(
                'newvideos',
                uploadedVideo._id,
                uploadedVideo.lang
            );
            await pushVideoToTag(
                req.body.tag,
                uploadedVideo._id,
                uploadedVideo.lang
            );
            await pushVideoToMe(
                req.userInfo.userId,
                uploadedVideo._id,
                uploadedVideo.lang
            );
            await pushFileToMe(
                req.userInfo.userId,
                videoInfo.fileId,
                videoInfo.blockId,
                uploadedVideo._id
            );
            await pushFileToMe(
                req.userInfo.userId,
                thumbnailInfo.fileId,
                thumbnailInfo.blockId,
                null
            );
            await createLiveChatForVideo(uploadedVideo._id);
        } catch (e) {
            logger.error(`Error in storeVideo.js: ${e}`);
        }
    }
);

module.exports = router;
