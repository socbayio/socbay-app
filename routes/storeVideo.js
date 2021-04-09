var express = require('express');
var router = express.Router();

const Video = require('../models/videoModel.js');
const User = require('../models/userModel.js');

//const redirectIfAuthenticatedMiddleware = require('../middleware/redirectIfAuthenticatedMiddleware');


router.post('/', function(req, res, next) {
    console.log('-------------------');
    User.findById(req.session.userId, (error, user ) =>{
        if (error) {
            return res.redirect('/login');
        }
        else {
            req.body.author ={username:user.username, emailaddress: user.emailaddress};
            console.log(req.body);
            Video.create(req.body,(error,user)=>{
                if (error) {
                /*     const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message);
                    req.flash('validationErrors',validationErrors);
                    req.flash('data',req.body); */
                    return res.redirect('/uploadvideo');
                }
                return res.redirect('/');
            });  // could do either User.create(req.body,(error, user)=>{res.redirect()})
        }
    })

    
});


module.exports = router;
