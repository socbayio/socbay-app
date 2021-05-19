var express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware.js');
var router = express.Router();
const User = require('../models/userModel.js');

router.get(
    '/',
    redirectIfNotAuthenticatedMiddleware,
    getInfoIfAuthenticated,
    async (req, res, next) => {
        try {
            userInfo = req.userInfo;
            const userFound = await User.findById(req.userInfo.userId)
                .populate('subscriptions.userId')
                .populate(
                    { 
                        path: 'uploadedVideos.videoId',
                        select: 'thumbnail like view title durationInSecond',
                        populate: {
                            path: 'thumbnail.blockId',
                            select: 'uploadedToNetwork CID'
                        }
                    }
                );
            userInfo.uploadedVideos = await Promise.all(userFound.uploadedVideos.map(async (video) =>{
                await video.videoId.thumbnail.subPopulate('fileId');
                if (video.videoId.thumbnail.blockId.uploadedToNetwork) {
                    video.videoId.thumbnail = {
                        link: video.videoId.thumbnail.blockId.CID + '/' + video.videoId.thumbnail.fileId.fileName
                    }
                } else {
                    video.videoId.thumbnail = {
                        link: video.videoId.thumbnail.fileId.CID
                    }
                }
                return video.videoId;
            }));
            userInfo.subscriptions = userFound.subscriptions.map(
                (s) => s.userId
            );

            res.render('myinfo', { userInfo });
        } catch (e) {
            console.error(`Myinfo fail with error: ${e}`);
            next(e);
        }
    }
);

module.exports = router;
