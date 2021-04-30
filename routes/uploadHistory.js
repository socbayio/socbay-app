var express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware.js');
var router = express.Router({ mergeParams: true });
const User = require('../models/userModel.js');
const Video = require('../models/videoModel');
let channelInfo = {};

router.get('/', getInfoIfAuthenticated, function(req, res, next) {
    
   

        res.render('uploadHistory', { userInfo: req.userInfo});
    
});

module.exports = router;
