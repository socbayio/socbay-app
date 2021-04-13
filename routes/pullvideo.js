var express = require('express');
var router = express.Router({ mergeParams: true });
const User = require('../models/userModel.js');
const Video = require('../models/videoModel.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    var emailaddress = "";
    var username = "";
    if(req.session.userId){
      User.findById(req.session.userId, (error, user)=>{
        username = user.username;
        emailaddress = user.emailaddress;
        Video.findById(req.params.videoId, (error, video)=>{
          res.render('video', {emailaddress: emailaddress, username: username,CID: video.CID, title:video.title, view: video.view, like: video.like, videoAuthor:video.author.username, description: video.description});
        })
      })
    }
    else {
      Video.findByIdAndUpdate(req.params.videoId,{$inc : {'view' : 1}} ,(error, video)=>{
        res.render('video', {CID: video.CID, title:video.title, view: video.view, like: video.like, videoAuthor:video.author.username, description: video.description});
    })
       /*  Video.findById(req.params.videoId, (error, video)=>{
            res.render('video', {CID: video.CID, title:video.title, view: video.view, like: video.like, videoAuthor:video.author.username, description: video.description});
        }) */
    }
});

module.exports = router;
