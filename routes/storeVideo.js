var express = require('express');
var router = express.Router();
const { getVideoDurationInSeconds } = require('get-video-duration');
const Video = require('../models/videoModel.js');
const User = require('../models/userModel.js');
const videoTag = require('../models/videoTagModel.js');
const liveChatVideo = require('../models/liveChatVideoModel');
var path = require('path');


const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware');
const verificationUpload = require('../middleware/verificationUpload');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');

const { pushVideoToTag, pushVideoToMe } = require('./common');

const createLiveChatForVideo = async (videoId)=>{
    await liveChatVideo.create({videoId: videoId});
}

const thumbnailDictionary = {
    'gaming': '/images/thumbnails/default/gaming.jpg',
    'tech': '/images/thumbnails/default/tech.jpg',
    'finance': '/images/thumbnails/default/finance.jpg',
    'cryptonews': '/images/thumbnails/default/cryptonews.jpg',
    'news': '/images/thumbnails/default/news.jpg',
    'lifestyle': '/images/thumbnails/default/lifestyle.jpg',
    'healthandfitness': '/images/thumbnails/default/healthandfitness.jpg',
    'music': '/images/thumbnails/default/notselected.jpg',
    'default': '/images/thumbnails/default/notselected.jpg'
}

router.post('/', redirectIfNotAuthenticatedMiddleware, getInfoIfAuthenticated, verificationUpload, async (req, res, next) => {  
    res.redirect('/');
    let fileToUpload = req.body;
    if (req.files && req.files.thumbnail) {
        let image = req.files.thumbnail;
        await image.mv(path.resolve(__dirname,'..','public/images/thumbnails',image.name)) //, (error)=>{}
        fileToUpload.thumbnail = '/images/thumbnails/' + image.name;
        let chooseDefaultImage = false; // To implement: when uploading fail -> chooseDefaultImage = true
    }
    
    if (!(req.files && req.files.thumbnail) || chooseDefaultImage) {
        if(req.body.tag in thumbnailDictionary){
            fileToUpload.thumbnail = thumbnailDictionary[req.body.tag];
        }
        else {
            fileToUpload.thumbnail = thumbnailDictionary["default"];
        }
    }
    
    fileToUpload.authorId = req.userInfo.userId;
    fileToUpload.networkStatus = {
        CID: req.body.CID, 
        networkName: 'local'
    }

    await getVideoDurationInSeconds('https://ipfs.io/ipfs/'+req.body.CID)
    .then((duration) => {
        fileToUpload.durationInSecond = duration;
        fileToUpload.fileUploadStatus = 'Successful';
    })
    .catch((error)=>{})

    const uploadedVideo = await Video.create(fileToUpload);
    
    if (uploadedVideo._id){
        await pushVideoToTag('newvideos',uploadedVideo._id);
        await pushVideoToTag(req.body.tag,uploadedVideo._id);
        await pushVideoToMe(req.userInfo.userId,uploadedVideo._id);
        await createLiveChatForVideo(uploadedVideo._id);
    }
    return;
});

module.exports = router;
