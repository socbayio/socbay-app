var express = require('express');
var router = express.Router();

const Video = require('../models/videoModel.js');
const User = require('../models/userModel.js');
const newVideo = require('../models/newVideosModel.js');

//const redirectIfAuthenticatedMiddleware = require('../middleware/redirectIfAuthenticatedMiddleware');


router.post('/', function(req, res, next) {
    console.log('-------------------');
    User.findById(req.session.userId, (error, user ) =>{
        if (!user) {
            return res.redirect('/login');
        }
        else {
            if (req.body.thumbnail == "") {req.body.thumbnail= "/images/courses/img-1.jpg"}
            req.body.author ={username:user.username, authorId: user._id};
            console.log(req.body);
            Video.create(req.body,(error,video)=>{
                if (error) {
                /*     const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message);
                    req.flash('validationErrors',validationErrors);
                    req.flash('data',req.body); */
                    return res.redirect('/uploadvideo');
                }
                newVideo.create({videoId:video._id});
                //console.log(video)
                return res.redirect('/');
            });  // could do either User.create(req.body,(error, user)=>{res.redirect()})
        }
    })

    
});


module.exports = router;
