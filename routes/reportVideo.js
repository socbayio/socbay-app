var express = require('express');
var router = express.Router({ mergeParams: true });

const User = require('../models/userModel');
const Video = require('../models/videoModel');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated');
var logger = require("../logger").Logger;

router.post(
    '/',
    redirectIfNotAuthenticatedMiddleware,
    getInfoIfAuthenticated,
    async (req, res, next) => {
        try {
            let report = {};
            if (req.body.reporttype == "other"){
                report.other = req.body.other;
            } else {
                report.reportCode = req.body[req.body.reporttype];
            }
            report.reporter = req.userInfo.userId;
            videoFound = await Video.findByIdAndUpdate(
                req.params.videoId, 
                { $push: { reports:  report } }
            )
            logger.reports(`Report video ${req.params.videoId}`);
            res.end();
        } catch (e) {
            console.log(`ERORORORORO ${e}`)
            next();
        }
    }
);

module.exports = router;
