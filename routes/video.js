var express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const redirectIfNotAuthenticated = require('../middleware/redirectIfNotAuthenticatedMiddleware');

var router = express.Router();
const User = require('../models/userModel.js');
const VideoReport = require('../models/videoReportModel.js');

router.get('/', getInfoIfAuthenticated, function (req, res, next) {
    res.render('video', { userInfo: req.userInfo });
});

async function saveToDb(req, res, next) {
    req.result = {
        success: 'OK',
        errorMessage: '',
    };

    try {
        const reportInfo = req.body.reportInfo;
        reportInfo.userId = req.userInfo.userId;

        const report = await VideoReport.create(reportInfo);
    } catch (err) {
        req.result.success = 'Failed';
        req.result.errorMessage = err.message;
    } finally {
        next();
    }
}

function response(req, res, next) {
    res.send(req.result);
}

router.post(
    '/report',
    redirectIfNotAuthenticated,
    getInfoIfAuthenticated,
    saveToDb,
    response
);

module.exports = router;
