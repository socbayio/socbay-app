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
                .populate('uploadedVideos.videoId')
                .populate('subscriptions.userId');
            userInfo.uploadedVideos = userFound.uploadedVideos.map(
                (v) => v.videoId
            );
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
