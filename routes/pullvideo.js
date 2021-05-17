var express = require('express');
var router = express.Router({ mergeParams: true });
const Video = require('../models/videoModel.js');
const liveChatVideo = require('../models/liveChatVideoModel');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const liveChat = require('../models/liveChatModel');
const { isEmptyObject } = require('./common');
const { getVideoDurationInSeconds } = require('get-video-duration');


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
    let link = 'https://ipfs.io/ipfs/';
    if (req.query.gateway in gateway) {
        link = gateway[req.query.gateway];
    }

    try {
        const videoFound = await Video.findById(req.params.videoId).populate(
            'authorId',
            'profilePicture username'
        );

        //const liveChatVideoFound = await liveChatVideo.findOne({videoId: req.params.videoId});
        const liveChatVideoFound = await liveChat.findOne({
            channel: 'global',
        });

        // Just for test
        if (videoFound && liveChatVideoFound) {
            req.videoInfo = {
                videoId: req.params.videoId,
                link: link + videoFound.networkStatus.CID,
                CID: videoFound.networkStatus.CID,
                title: videoFound.title,
                view: videoFound.view,
                like: videoFound.like,
                videoAuthor: videoFound.authorId.username,
                videoAuthorId: videoFound.authorId._id,
                videoAuthorPicture: videoFound.authorId.profilePicture,
                description: videoFound.description,
            };
            req.liveChat = {
                messages: liveChatVideoFound.messages,
            };

            next();
        } else {
            throw new Error('No livechat | No video');
        }
    } catch (e) {
        console.error(`Pull video fail with error: ${e}`);
        next(e);
    }
}

function updateVideoDuration(req, res, next) {
    const videoId = req.params.videoId;
    console.log(req.params.videoId);
    getVideoDurationInSeconds('https://ipfs.io/ipfs/' + req.videoInfo.CID)
    .then(async (duration) => {       
        await Video.findByIdAndUpdate(videoId, { durationInSecond: duration });
    })
    .catch((error) => {console.error(error)});
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
