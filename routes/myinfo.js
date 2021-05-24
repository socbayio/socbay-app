var express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware.js');
var router = express.Router();
const User = require('../models/userModel.js');
const logger = require('../logger').Logger;

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
                return video.videoId;
            }));
            userInfo.subscriptions = userFound.subscriptions.map(
                (s) => s.userId
            );

            res.render('myinfo', { userInfo, tab: req.query.tab });
        } catch (e) {
            logger.error(`Myinfo fail with error: ${e}`);
            next(e);
        }
    }
);

module.exports = router;
