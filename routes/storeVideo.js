var express = require('express');
var router = express.Router();
const { getVideoDurationInSeconds } = require('get-video-duration');
const Video = require('../models/videoModel.js');
const User = require('../models/userModel.js');
const newVideo = require('../models/newVideosModel.js');
const videoTag = require('../models/videoTagModel.js');
var path = require('path');

const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware');

router.post('/', function(req, res, next) {
    User.findById(req.session.userId, async (error, user ) =>{
        if (!user) {
            return res.redirect('/login');
        }
        else {
            res.redirect('/');
            if (!(req.files && req.files.thumbnail)) {
                switch (req.body.tag) {
                    case 'gaming':
                        req.body.thumbnail = '/images/thumbnails/default/gaming.jpg';
                        break;
                    case 'tech':
                        req.body.thumbnail = '/images/thumbnails/default/tech.jpg';
                        break;
                    case 'finance':
                        req.body.thumbnail = '/images/thumbnails/default/finance.jpg';
                        break;
                    case 'cryptonews':
                        req.body.thumbnail = '/images/thumbnails/default/cryptonews.jpg';
                        break;
                    case 'news':
                        req.body.thumbnail = '/images/thumbnails/default/news.jpg';
                        break;
                    case 'lifestyle':
                        req.body.thumbnail = '/images/thumbnails/default/lifestyle.jpg';
                        break;
                    case 'healthandfitness':
                        req.body.thumbnail = '/images/thumbnails/default/healthandfitness.jpg';
                        break;
                    case 'music':
                        req.body.thumbnail = '/images/thumbnails/default/music.jpg';
                        break;
                    default: 
                        req.body.thumbnail = '/images/thumbnails/default/notselected.jpg';
                }
            }
            else {
                let image = req.files.thumbnail;
                image.mv(path.resolve(__dirname,'..','public/images/thumbnails',image.name), (error)=>{ 
                })
                req.body.thumbnail = '/images/thumbnails/' + image.name;
            }
            req.body.author ={username:user.username, authorId: user._id};  
            await getVideoDurationInSeconds('https://ipfs.io/ipfs/'+req.body.CID)
            .then((duration) => {
                req.body.durationInSecond = duration;})
            .catch((error)=>{})
            
            Video.create(req.body,(error,video)=>{
                if (error) {
                    return;
                }
                newVideo.create({videoId:video._id});
                User.updateOne({_id: user._id},{ $push: { uploadedVideos: video._id} },(error,tag)=>{});
                videoTag.updateOne({tagName:'newvideos'},{ $push: { videos: video._id} },(error,tag)=>{});
                videoTag.findOne({tagName:req.body.tag},(error,tag)=>{
                    if (!tag){
                        videoTag.create({tagName: req.body.tag, videos:[video._id]},(errortag,newtag)=>{})
                    }
                    else {
                        videoTag.updateOne({tagName:req.body.tag},{ $push: { videos: video._id} },(error,tag)=>{});
                    }
                })
                return;
            });  
        }
    })
});

module.exports = router;
