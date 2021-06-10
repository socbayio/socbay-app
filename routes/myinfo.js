const express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware');

const router = express.Router();
const User = require('../models/userModel');
const logger = require('../logger').Logger;

router.get(
    '/',
    redirectIfNotAuthenticatedMiddleware,
    getInfoIfAuthenticated,
    async (req, res, next) => {
        try {
            const { userInfo } = req;
            const userFound = await User.findById(req.userInfo.userId)
                .populate('subscriptions.userId')
                .populate({
                    path: 'uploadedVideos.videoId',
                    select: 'thumbnail like view title durationInSecond isDeleted',
                    populate: {
                        path: 'thumbnail.blockId',
                        select: 'uploadedToNetwork CID',
                    },
                });
            const uploadedVideos = await Promise.all(
                userFound.uploadedVideos.map(async (video) => {
                    await video.videoId.thumbnail.subPopulate('fileId');
                    if (!video.videoId.isDeleted) {
                        return video.videoId;
                    }
                    return null;
                })
            );
            userInfo.uploadedVideos = uploadedVideos.filter((x) => x !== null);
            userInfo.subscriptions = userFound.subscriptions.map(
                (s) => s.userId
            );
            res.render('myinfo', {
                userInfo,
                tab: req.query.tab,
            });
        } catch (e) {
            logger.error(`Myinfo fail with error: ${e}`);
            next(e);
        }
    }
);

module.exports = router;
