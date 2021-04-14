const { getVideoDurationInSeconds } = require('get-video-duration')
const User = require('./models/userModel.js');
const Video = require('./models/videoModel.js');
const newVideo = require('./models/newVideosModel.js');

const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27028/crustlive", {
    "auth": { "authSource": "admin" },
    "user": "ntn",
    "pass": "wv%nzw=VY$fMwV4",
    "useNewUrlParser": true
});

Video.find({},async (error, results)=>{
    for (let videoCount = 0; videoCount<results.length; videoCount++){
        await getVideoDurationInSeconds('https://ipfs.io/ipfs/'+results[videoCount].CID).then((duration) => {
            Video.findByIdAndUpdate(results[videoCount]._id, {$set : {durationInSecond: duration}}, {upsert:true}, (res,error)=>{console.log(res,error)})
        }).catch((error)=>{console.log('abc')})
    }
})




