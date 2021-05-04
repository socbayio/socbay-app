var express = require('express');
var router = express.Router({ mergeParams: true });
const Video = require('../models/videoModel.js');
const liveChatVideo = require('../models/liveChatVideoModel');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const liveChat = require('../models/liveChatModel');
const gateway = {
  'ipfs': 'https://ipfs.io/ipfs/',
  'crust': 'https://crustwebsites.net/ipfs/',
  'oneloveipfs': 'https://video.oneloveipfs.com/ipfs/'
}

router.get('/', getInfoIfAuthenticated, async (req, res, next) => {
    let link = "https://ipfs.io/ipfs/";
    if(req.query.gateway in gateway) {
      link = gateway[req.query.gateway]
    }
 
    try {
      const videoFound = await Video.findByIdAndUpdate(req.params.videoId, {$inc : {'view' : 1}}).populate('authorId','profilePicture username');
      //const liveChatVideoFound = await liveChatVideo.findOne({videoId: req.params.videoId});
      const liveChatVideoFound = await liveChat.findOne({channel:'global'});// Just for test
      if (videoFound && liveChatVideoFound ) {
        let videoInfo = {
          videoId: req.params.videoId,
          link: link + videoFound.networkStatus.CID,
          title:videoFound.title,
          view: videoFound.view, 
          like: videoFound.like, 
          videoAuthor:videoFound.authorId.username,
          videoAuthorId: videoFound.authorId._id,
          videoAuthorPicture: videoFound.authorId.profilePicture,
          description: videoFound.description
        }
        let liveChat = {
          messages: liveChatVideoFound.messages
        }
        console.log(videoInfo)
        console.log(liveChat)
        res.render('video', {userInfo: req.userInfo, liveChat, videoInfo});
      }
      else {
        throw new Error('No livechat | No video');
      }
    } catch (e) {
      console.error(`Pull video fail with error: ${e}`)
      next(e);
    }
});

module.exports = router;
