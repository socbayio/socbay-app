var express = require('express');
var router = express.Router();
const User = require('../models/userModel.js');
const Video = require('../models/videoModel.js');
const newVideo = require('../models/newVideosModel.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  var emailaddress = "";
  var username = "";
  var newVideosInfo = [];
  newVideo.find({},(error, results)=>{
    for (let videoCount = results.length-1; videoCount>-1; videoCount--){
      Video.findById(results[videoCount].videoId, (error,foundVideo)=>{
        newVideosInfo.push(foundVideo)
        if (!videoCount){
          //console.log(newVideosInfo[0])
          if(req.session.userId){
            User.findById(req.session.userId, (error, user)=>{
              username = user.username;
              emailaddress = user.emailaddress;
              return res.render('index', {emailaddress: emailaddress, username: username, videos: newVideosInfo});
            }) 
          }
          else {
            console.log('zzzzzzzzzzzzzzzzz')
            //res.render('index');
            return res.render('index',{videos: newVideosInfo});
          }



          //return res.render('index',{videos: newVideosInfo});



        }
      })
    }
  })


});

module.exports = router;
