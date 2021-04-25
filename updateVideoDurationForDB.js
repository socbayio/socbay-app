const { getVideoDurationInSeconds } = require('get-video-duration')
const User = require('./models/userModel.js');
const Video = require('./models/videoModel.js');
const newVideo = require('./models/newVideosModel.js');

const mongoose = require('mongoose');

mongoose.connect("mongodb://34.96.245.194:27028/crustlive", {
    "auth": { "authSource": "admin" },
    "user": "ntn",
    "pass": "wv%nzw=VY$fMwV4",
    "useNewUrlParser": true
});



Video.find({},async (error, results)=>{
    for (let videoCount = 0; videoCount<results.length; videoCount++){
        User.updateOne({_id:results[videoCount].author.authorId},{ $push: { uploadedVideos: results[videoCount]._id} },(error,tag)=>{});
        
    }
}) 


