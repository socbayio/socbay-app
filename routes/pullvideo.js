var express = require('express');
var router = express.Router({ mergeParams: true });
const Video = require('../models/videoModel.js');
const liveChatVideo = require('../models/liveChatVideoModel');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const liveChat = require('../models/liveChatModel');
const { isEmptyObject } = require('./common');

const gateway = {
    ipfs: 'https://ipfs.io/ipfs/',
    crust: 'https://crustwebsites.net/ipfs/',
    oneloveipfs: 'https://video.oneloveipfs.com/ipfs/',
};

function checkSubscribed(req, res, next) {
    if (!isEmptyObject(req.userInfo)) {
        req.userInfo.authorSubscribeb = false;
        const authorSubscribed = req.userInfo.subscriptionsId.find(
            (s) => s.userId === req.userInfo.videoAuthorId
        );
        req.userInfo.authorSubscribeb = authorSubscribed !== null;
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
    render
);

module.exports = router;
