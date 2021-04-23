var express = require('express');
var router = express.Router({ mergeParams: true });
const User = require('../models/userModel.js');
const Video = require('../models/videoModel.js');
const liveChat = require('../models/liveChatModel');


/* GET home page. */
router.post('/', function(req, res) {
    Video.findByIdAndUpdate(req.params.videoId,{$inc : {'like' : 1}} ,(error, video)=>{
        res.end();
    })
});

module.exports = router;
