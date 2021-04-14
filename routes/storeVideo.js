var express = require('express');
var router = express.Router();
const { getVideoDurationInSeconds } = require('get-video-duration');
const Video = require('../models/videoModel.js');
const User = require('../models/userModel.js');
const newVideo = require('../models/newVideosModel.js');

//const redirectIfAuthenticatedMiddleware = require('../middleware/redirectIfAuthenticatedMiddleware');


router.post('/', function(req, res, next) {
    console.log('-------------------');
    User.findById(req.session.userId, async (error, user ) =>{
        if (!user) {
            return res.redirect('/login');
        }
        else {
            res.redirect('/');

            if (req.body.thumbnail == "") {req.body.thumbnail= "/images/courses/img-1.jpg"}
            req.body.author ={username:user.username, authorId: user._id};
            
            await getVideoDurationInSeconds('https://ipfs.io/ipfs/'+req.body.CID)
            .then((duration) => {
                req.body.durationInSecond = duration;})
            .catch((error)=>{})
            
            //console.log(req.body);
            Video.create(req.body,(error,video)=>{
                if (error) {
                    return;
                }
                newVideo.create({videoId:video._id});
                return;
            });  
        }
    })

    
});


module.exports = router;
