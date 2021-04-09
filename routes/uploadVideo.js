var express = require('express');
var router = express.Router();
const User = require('../models/userModel.js');

router.get('/', function(req, res, next) {
  var emailaddress = "";
  var username = "";
  if(req.session.userId){
    User.findById(req.session.userId, (error, user)=>{
      username = user.username;
      emailaddress = user.emailaddress;
      res.render('uploadVideo', {emailaddress: emailaddress, username: username});
    }) 
  }
  else {
    res.render('uploadVideo');
  }
});


module.exports = router;
