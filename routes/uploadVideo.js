var express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware.js');
var router = express.Router();
const User = require('../models/userModel.js');

router.get(
    '/',
    redirectIfNotAuthenticatedMiddleware,
    getInfoIfAuthenticated,
    function (req, res, next) {
        res.render('uploadVideo', { userInfo: req.userInfo });
    }
);

function getDataFromReq(req, res, next) {
    const body = req.body;
}

router.post(
    '/testUploadFiles',
    redirectIfNotAuthenticatedMiddleware,
    getInfoIfAuthenticated,
    getDataFromReq
);

module.exports = router;
