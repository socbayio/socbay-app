var express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
var router = express.Router();
const User = require('../models/userModel.js');

/* GET home page. */
router.get('/', getInfoIfAuthenticated, function(req, res, next) {
  var emailaddress = "";
  var username = "";
  if(req.session.userId){
    User.findById(req.session.userId, (error, user)=>{
      username = user.username;
      emailaddress = user.emailaddress;
      res.render('video', {emailaddress: emailaddress, username: username, userInfo: req.userInfo});
    }) 
  }
  else {
    res.render('video');
  }
});

module.exports = router;
