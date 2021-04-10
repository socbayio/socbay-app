var express = require('express');
var router = express.Router();

const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const redirectIfAuthenticatedMiddleware = require('../middleware/redirectIfAuthenticatedMiddleware');


router.post('/', redirectIfAuthenticatedMiddleware, function(req, res, next) {

    const { emailaddress, password } = req.body;

    User.findOne({emailaddress:emailaddress}, (error,user) => {
        if (user){
            bcrypt.compare(password, user.password, (error, same) =>{
                if(same){ // if passwords match
                // store user session, will talk about it later
                    req.session.userId = user._id;
                    res.redirect('/');
                } else{
                    res.redirect('/login');
                }
             })
        } else {
            res.redirect('/login');
        }
    })
   
});


module.exports = router;
