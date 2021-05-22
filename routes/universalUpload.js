var express = require('express');
var router = express.Router();
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');

router.get(
    '/',
    getInfoIfAuthenticated,
    function (req, res, next) {
        res.render('universalUpload', { userInfo: req.userInfo });
    }
);

module.exports = router;
