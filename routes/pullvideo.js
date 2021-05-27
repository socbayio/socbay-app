var express = require('express');
var router = express.Router({ mergeParams: true });
const Video = require('../models/videoModel.js');
const liveChatVideo = require('../models/liveChatVideoModel');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const liveChat = require('../models/liveChatModel');
const { isEmptyObject } = require('./common');
const { getVideoDurationInSeconds } = require('get-video-duration');
const logger = require('../logger').Logger;



const gateway = {
    ipfs: 'https://ipfs.io/ipfs/',
    crust: 'https://crustwebsites.net/ipfs/',
    oneloveipfs: 'https://video.oneloveipfs.com/ipfs/',
};

async function checkSubscribed(req, res, next) {
    if (!isEmptyObject(req.userInfo)) {
        req.userInfo.authorSubscribed = false;
        const authorSubscribed = req.userInfo.subscriptionsId.find(
            (s) => s.userId.toString() === req.videoInfo.videoAuthorId.toString()
        );
        req.userInfo.authorSubscribed = authorSubscribed !== undefined;
    }
    next();
}

async function increaseView(req, res, next) {
    const videoFound = await Video.findByIdAndUpdate(req.params.videoId, {
        $inc: { view: 1 },
    });
    next();
}

async function getVideo(req, res, next) {
    try {
        let link = 'https://ipfs.io/ipfs/';
        if (req.query.gateway in gateway) {
            link = gateway[req.query.gateway];
        }

        const videoFound = await Video.findById(req.params.videoId).populate(
            'authorId',
            'profilePicture username'
        ).populate(
            'networkStatus.blockId',
            'uploadedToNetwork CID'
        );

        await videoFound.networkStatus.subPopulate('fileId');
        await videoFound.thumbnail.subPopulate('fileId');
        //const liveChatVideoFound = await liveChatVideo.findOne({videoId: req.params.videoId});
        const liveChatVideoFound = await liveChat.findOne({
            channel: 'global',
        });

        // Just for test
        if (videoFound && liveChatVideoFound) {
            req.videoInfo = {
                videoId: req.params.videoId,
                link: link + videoFound.networkStatus.fileId.CID,
                thumbnailLink: link + videoFound.thumbnail.fileId.CID,
                ref: videoFound.ref,
                CID: videoFound.networkStatus.CID,
                title: videoFound.title,
                view: videoFound.view,
                like: videoFound.like,
                videoAuthor: videoFound.authorId.username,
                videoAuthorId: videoFound.authorId._id,
                videoAuthorPicture: videoFound.authorId.profilePicture,
                description: videoFound.description,
                durationInSecond: videoFound.durationInSecond,
            };
            req.liveChat = {
                messages: liveChatVideoFound.messages,
            };

            if (req.query.gateway == undefined) {
                req.videoInfo.gateway = 'auto';
            } else {
                req.videoInfo.gateway = req.query.gateway;
            }

            next();
        } else {
            throw new Error('No livechat | No video');
        }
    } catch (e) {
        logger.error(`Pull video fail with error: ${e}`);
        next(e);
    }
}

function updateVideoDuration(req, res, next) {
    if (!req.videoInfo.durationInSecond) {
        const videoId = req.params.videoId;
        getVideoDurationInSeconds('https://ipfs.io/ipfs/' + req.videoInfo.CID)
        .then(async (duration) => {       
            await Video.findByIdAndUpdate(videoId, { durationInSecond: duration });
        })
        .catch((error) => {logger.error(error)});
    }
    next();
}

function render(req, res, next) {
    res.render('video', {
        userInfo: req.userInfo,
        liveChat: req.liveChat,
        videoInfo: req.videoInfo,
    });
}

router.get(
    '/',
    getInfoIfAuthenticated,
    increaseView,
    getVideo,
    checkSubscribed,
    updateVideoDuration,
    render
    
);

module.exports = router;
