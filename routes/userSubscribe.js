var express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware.js');
var router = express.Router();
const User = require('../models/userModel.js');

function requireAuth(req, res, next) {
    if (!req.session.userId) {
        res.send({ error: 'Auth required !' });
    }
    next();
}

async function getUsersInfo(req, res, next) {
    const userInfo = await User.findById(req.body.userId);
    const authorInfo = await User.findById(req.body.authorId);
    req.userInfo = userInfo;
    req.authorInfo = authorInfo;

    next();
}

async function subscribeUser(req, res, next) {
    User.update(
        { _id: req.userInfo.userId },
        {
            $addToSet: {
                subscriptions: req.authorInfo._id,
            },
        }
    );
    const userInfo = await User.findById(req.body.userId);
    //req.send({ updateduserInfo: req.userInfo, authorInfo: req.authorInfo });
}

router.post('/', requireAuth, getUsersInfo, subscribeUser);

module.exports = router;
