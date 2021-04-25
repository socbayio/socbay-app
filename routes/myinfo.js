var express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware.js');
var router = express.Router();
const User = require('../models/userModel.js');
const Video = require('../models/videoModel');

function getArrayVideo(videoIdArray){
    return new Promise(function(resolve, reject){
        if (videoIdArray.length == 0) {
            resolve([]);
        }
        var videoArray = [];
        var loopCount = 0;
        for (let videoCount = 0; videoCount< videoIdArray.length; videoCount++){
            Video.findById(videoIdArray[videoCount],(error, video)=>{
                videoArray.push(video);
                loopCount++;
                if (loopCount == videoIdArray.length){
                    resolve(videoArray);
                }
            })
        }
    })
}

function getArraySubscriptions(subscriptionsId){
    return new Promise(function(resolve, reject){
        if (subscriptionsId.length == 0) {
            resolve([]);
        }
        var subscriptionsArray = [];
        var loopCount = 0;
        for (let subCount = 0; subCount< subscriptionsId.length; subCount++){
            User.findById(subscriptionsId[subCount],(error, user)=>{
                subscriptionsArray.push(user);
                loopCount++;
                if (loopCount == subscriptionsId.length){
                    resolve(subscriptionsArray);
                }
            })
        }
    })
}

/* GET home page. */
router.get('/', redirectIfNotAuthenticatedMiddleware, getInfoIfAuthenticated, function(req, res, next) {
    var promises = [];
    promises.push(getArrayVideo(req.userInfo.uploadedVideos)); 
    promises.push(getArraySubscriptions(req.userInfo.subscriptionsId));
    
    Promise.all(promises).then(function(values){
        req.userInfo.uploadedVideos = values[0];
        req.userInfo.subscriptions = values[1];
        console.log(values)
        res.render('myinfo', {emailaddress: req.userInfo.emailaddress, username: req.userInfo.username, userInfo: req.userInfo});
    })    
});

module.exports = router;
