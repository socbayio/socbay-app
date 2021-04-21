var express = require('express');
var router = express.Router({ mergeParams: true });
const User = require('../models/userModel.js');
const Video = require('../models/videoModel.js');
const liveChat = require('../models/liveChatModel');


/* GET home page. */
router.get('/', function(req, res, next) {
    var emailaddress = "";
    var username = "";
    var link = "";
    switch (req.query.gateway){
      case 'ipfs':
        link = 'https://ipfs.io/ipfs/';
        break;
      case 'crust':
        link = 'https://crustwebsites.net/ipfs/';
        break;
      case 'oneloveipfs':
        link = 'https://video.oneloveipfs.com/ipfs/';
        break;
      default:
        link = 'https://ipfs.io/ipfs/';
    }
    
    if(req.session.userId){
      User.findById(req.session.userId, (error, user)=>{
        username = user.username;
        emailaddress = user.emailaddress;
        Video.findByIdAndUpdate(req.params.videoId, {$inc : {'view' : 1}} , (error, video)=>{
          if (error) {
            res.render('/');
          }
          else{
            liveChat.findOne({channel:'global'},(error,channelLiveChat)=>{
              res.render('video', {liveChat: channelLiveChat.messages, videoId: req.params.videoId ,emailaddress: emailaddress, username: username,link: link + video.CID, title:video.title, view: video.view, like: video.like, videoAuthor:video.author.username, description: video.description});
            })
          }
        })
      })
    }
    else {
      Video.findByIdAndUpdate(req.params.videoId,{$inc : {'view' : 1}} ,(error, video)=>{
        if (error){
          res.render('/')
        }
        else {
          liveChat.findOne({channel:'global'},(error,channelLiveChat)=>{
            console.log(error,channelLiveChat)
            res.render('video', {liveChat: channelLiveChat.messages, videoId: req.params.videoId, link: link+video.CID, title:video.title, view: video.view, like: video.like, videoAuthor:video.author.username, description: video.description});
          })
        }
      })
       /*  Video.findById(req.params.videoId, (error, video)=>{
            res.render('video', {CID: video.CID, title:video.title, view: video.view, like: video.like, videoAuthor:video.author.username, description: video.description});
        }) */
    }
});

module.exports = router;
