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
    const userUpdated = await User.findOneAndUpdate(
        { _id: req.userInfo.userId },
        {
            $push: {
                subscriptions: req.authorInfo._id,
            },
        }
    );
    const userInfo = await User.findById(req.userInfo.userId);

    res.send({ updateduserInfo: userInfo, authorInfo: req.authorInfo });
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

module.exports = router;
