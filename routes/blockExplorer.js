var express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware.js');
var router = express.Router();
const User = require('../models/userModel.js');

router.get('/', getInfoIfAuthenticated, async (req, res, next) => {
    try {
        userInfo = req.userInfo;
        res.render('blockExplorer', {userInfo});
    } catch (e) {
        console.error(`BlockExplorer fail with error: ${e}`);
        next(e);
    }
});

module.exports = router;
