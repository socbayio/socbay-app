var express = require('express');
var router = express.Router();
const User = require('../models/userModel.js');
const Video = require('../models/videoModel.js');
const newVideo = require('../models/newVideosModel.js');

router.get('/', function(req, res, next) {
  var emailaddress = "";
  var username = "";
  var newVideosInfo = [];
  newVideo.find({},(error, results)=>{
    let pushedvideo = 0;
    for (let videoCount = 0; videoCount<results.length; videoCount++){
      Video.findById(results[videoCount].videoId, (error,foundVideo)=>{
        pushedvideo++;
        if(foundVideo != null){
          newVideosInfo.push(foundVideo);
        }
        if (pushedvideo==results.length){
          if(req.session.userId){
            User.findById(req.session.userId, (error, user)=>{
              username = user.username;
              emailaddress = user.emailaddress;
              return res.render('index', {emailaddress: emailaddress, username: username, videos: newVideosInfo});
            }) 
          }
          else {
            return res.render('index',{videos: newVideosInfo});
          }
        }
      })
    }
  })

});

module.exports = router;
