var express = require('express');
var router = express.Router({ mergeParams: true });
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware');
const Video = require('../models/videoModel.js');
const logger = require('../logger').Logger;

router.get('/', redirectIfNotAuthenticatedMiddleware, getInfoIfAuthenticated, async function (req, res, next) {
    try {
        console.log(req.params);
        const videoFound = await Video.findById(req.params.videoId);
        console.log(videoFound);
        console.log(req.userInfo)
        if (videoFound) {
            if(videoFound.authorId.toString() == req.userInfo.userId.toString()) {
                Video.findByIdAndUpdate(req.params.videoId, {isDeleted: true})
                .then();
            }
        }
        res.redirect('/uploadhistory');
    } catch (e) {
        logger.error(`Delete video page fail with error: ${e}`);
        next(e);
    }
});

module.exports = router;
