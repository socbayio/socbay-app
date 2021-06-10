const express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware');

const router = express.Router();

router.get(
    '/',
    redirectIfNotAuthenticatedMiddleware,
    getInfoIfAuthenticated,
    (req, res, next) => {
        res.render('uploadVideo', { userInfo: req.userInfo });
    }
);

module.exports = router;
