var express = require('express');
var router = express.Router();
const User = require('../models/userModel.js');
const Video = require('../models/videoModel.js');
const newVideo = require('../models/newVideosModel.js');
const videoTag = require('../models/videoTagModel.js');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');

function getArrayVideo(tag){
  return new Promise(function(resolve, reject){
    videoTag.findOne({tagName: tag}, (error,tagFound)=>{
      if(tagFound){
        var videoArray = []
        var loopCount = 0; 
        if (tagFound.videos.length == 0){
          resolve();
        }
        for (let videoCount = 0; videoCount< tagFound.videos.length; videoCount++){
          Video.findById(tagFound.videos[videoCount],(error, video)=>{
            loopCount++;
            if (video){
              videoArray.push(video);
            }
            if (loopCount == tagFound.videos.length){
              resolve({name:tag, videos: videoArray});
            }
          })
        }
      }
      else{
        resolve();
      }
    })
  })
}

router.get('/', getInfoIfAuthenticated, function(req, res) {
  var emailaddress = "";
  var username = "";
  var promises = [];

  promises.push(getArrayVideo('newvideos'))
  promises.push(getArrayVideo('gaming'))
  promises.push(getArrayVideo('tech'))
  promises.push(getArrayVideo('finance'))
  promises.push(getArrayVideo('cryptonews'))
  promises.push(getArrayVideo('news'))
  promises.push(getArrayVideo('lifestyle'))
  promises.push(getArrayVideo('healthandfitness'))
  promises.push(getArrayVideo('music'))

  Promise.all(promises).then(function(values){
    if(req.session.userId){
      User.findById(req.session.userId, (error, user)=>{
        username = user.username;
        emailaddress = user.emailaddress;
        return res.render('index', {userInfo: req.userInfo, emailaddress: emailaddress, username: username, renderVideos: values.filter(x => x !== undefined)});
      }) 
    }
    else {
      return res.render('index',{renderVideos: values.filter(x => x !== undefined)});
    }
  })
  .catch(error=>{
    console.error(error)
  })
});

module.exports = router;
