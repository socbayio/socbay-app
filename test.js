const { getVideoDurationInSeconds } = require('get-video-duration')



getVideoDurationInSeconds('https://ipfs.io/ipfs/QmNbmaa5gjw1WFSJ4rKNvJ9eCW8rWGgD7kkvsn6LqgAFn9').then((duration) => {
    console.log(duration)
})

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
  var emailaddress = "";
  var username = "";
  var newVideosInfo = [];
//Video.find({_id:'607559a599b02423a46ca433'},(error, result)=>{console.log(error,result)})
//Video.updateOne({_id:'607559a599b02423a46ca433'}, ,{upsert:true}).then((result,error)=>{console.log(result,error)})
Video.findByIdAndUpdate('607559a599b02423a46ca432', {$set : {durationInSecond: 30}}, {upsert:true}, (res,error)=>{console.log(res,error)})
console.log('------------')

   Video.find({},(error, results)=>{
    
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


