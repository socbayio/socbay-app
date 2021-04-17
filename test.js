const User = require('./models/userModel.js');
const Video = require('./models/videoModel.js');
const newVideo = require('./models/newVideosModel.js');
const videoTag = require('./models/videoTagModel.js');


const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27028/crustlive", {
    "auth": { "authSource": "admin" },
    "user": "ntn",
    "pass": "wv%nzw=VY$fMwV4",
    "useNewUrlParser": true
});

//videoTag.create({tagName:'newVideos',videos:[]},(error,tag)=>{console.log(error,tag)});
videoTag.updateOne({tagName:'newVideos'},{ $push: { videos: 'abcde' } },(error,tag)=>{console.log(error,tag)});
videoTag.findOne({tagName:'newVideos'},(error,tag)=>{console.log(error,tag)})



