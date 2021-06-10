const express = require('express');

const router = express.Router({ mergeParams: true });
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware');
const Video = require('../models/videoModel');
const logger = require('../logger').Logger;

router.get(
    '/',
    redirectIfNotAuthenticatedMiddleware,
    getInfoIfAuthenticated,
    async (req, res, next) => {
        try {
            const videoFound = await Video.findById(req.params.videoId);
            if (videoFound) {
                if (
                    videoFound.authorId.toString() ===
                    req.userInfo.userId.toString()
                ) {
                    Video.findByIdAndUpdate(req.params.videoId, {
                        isDeleted: true,
                    }).then();
                }
            }
            res.redirect('/uploadhistory');
        } catch (e) {
            logger.error(`Delete video page fail with error: ${e}`);
            next(e);
        }
    }
);

module.exports = router;
