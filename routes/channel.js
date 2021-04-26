var express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware.js');
var router = express.Router({ mergeParams: true });
const User = require('../models/userModel.js');
const Video = require('../models/videoModel');
let channelInfo = {};
function getArrayVideo(channelId){
    return new Promise(function(resolve, reject){
        User.findById(channelId,(error, user)=>{
            if (user){
                channelInfo = user;
                
                if (user.uploadedVideos.length == 0) {
                    resolve([]);
                }
                var videoArray = [];
                var loopCount = 0;
                for (let videoCount = 0; videoCount< user.uploadedVideos.length; videoCount++){
                    Video.findById(user.uploadedVideos[videoCount],(error, video)=>{
                        videoArray.push(video);
                        loopCount++;
                        if (loopCount == user.uploadedVideos.length){
                            resolve(videoArray);
                        }
                    })
                }
            }
        })

    })
}

router.get('/', getInfoIfAuthenticated, function(req, res, next) {
    var promises = [];
    
    promises.push(getArrayVideo(req.params.channelId)); 
    Promise.all(promises).then(function(values){
        channelInfo.uploadedVideos = values[0];
        console.log(channelInfo)
        channelInfo.subscriptions = [];
        res.render('channel', {channelInfo : channelInfo, userInfo: req.userInfo});
    })    
});

module.exports = router;
