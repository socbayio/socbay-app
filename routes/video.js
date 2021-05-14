var express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware.js');
var router = express.Router();
const User = require('../models/userModel.js');

async function getAuthorInfo(req, res, next) {
    const authorInfo = await User.findById(req.body.authorId);
    req.authorInfo = authorInfo;
    // res.send({ userInfo: req.userInfo, authorInfo: authorInfo });
    next();
}

async function subscribeUser(req, res, next) {
    const authorId = req.authorInfo._id;

    const updatedUser = await User.findById(req.userInfo.userId);
    if (
        !updatedUser.subscriptions.some(sub => sub.userId.toString() === authorId.toString()) && 
        !(req.userInfo.userId.toString() == authorId.toString())
        )
    {
        updatedUser.subscriptions.push({userId: authorId});
        await updatedUser.save();
    }

    res.send({});
}

async function unsubscribeUser(req, res, next) {
    const authorId = req.authorInfo._id;

    const updatedUser = await User.findOneAndUpdate(
        { _id: req.userInfo.userId },
        { $pull: { subscriptions: { userId: authorId } } }
    );

    res.send({});
}

router.get('/', getInfoIfAuthenticated, function (req, res, next) {
    res.render('video', { userInfo: req.userInfo });
});

router.post(
    '/author/subscribe',
    redirectIfNotAuthenticatedMiddleware,
    getInfoIfAuthenticated,
    getAuthorInfo,
    subscribeUser
);

router.post(
    '/author/unsubscribe',
    redirectIfNotAuthenticatedMiddleware,
    getInfoIfAuthenticated,
    getAuthorInfo,
    unsubscribeUser
);

module.exports = router;
