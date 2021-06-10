const express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated');
const redirectIfNotAuthenticated = require('../middleware/redirectIfNotAuthenticatedMiddleware');

const router = express.Router();
const User = require('../models/userModel');
const VideoReport = require('../models/videoReportModel');

async function getAuthorInfo(req, res, next) {
    const authorInfo = await User.findById(req.body.authorId);
    req.authorInfo = authorInfo;
    next();
}

async function subscribeUser(req, res, next) {
    const authorId = req.authorInfo._id;

    const updatedUser = await User.findById(req.userInfo.userId);
    if (
        !updatedUser.subscriptions.some(
            (sub) => sub.userId.toString() === authorId.toString()
        ) &&
        !(req.userInfo.userId.toString() == authorId.toString())
    ) {
        updatedUser.subscriptions.push({ userId: authorId });
        await updatedUser.save();
    }

    res.send({});
}

async function unsubscribeUser(req, res, next) {
    const authorId = req.authorInfo._id;

    await User.findOneAndUpdate(
        { _id: req.userInfo.userId },
        { $pull: { subscriptions: { userId: authorId } } }
    );

    res.send({});
}

router.get('/', getInfoIfAuthenticated, (req, res, next) => {
    res.render('video', { userInfo: req.userInfo });
});

router.post(
    '/author/subscribe',
    redirectIfNotAuthenticated,
    getInfoIfAuthenticated,
    getAuthorInfo,
    subscribeUser
);

router.post(
    '/author/unsubscribe',
    redirectIfNotAuthenticated,
    getInfoIfAuthenticated,
    getAuthorInfo,
    unsubscribeUser
);

async function saveToDb(req, res, next) {
    req.result = {
        success: 'OK',
        errorMessage: '',
    };

    try {
        const { reportInfo } = req.body;
        reportInfo.userId = req.userInfo.userId;

        await VideoReport.create(reportInfo);
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
