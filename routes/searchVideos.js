var express = require('express');
var router = express.Router();
const Video = require('../models/videoModel.js');


router.get('/', (req,res)=>{
    var emailaddress = "";
    var username = "";
    var promises = [];

    Video.find({$text: {$search: req.query.keyword}}, (error,result)=>{
        if(req.session.userId){
            User.findById(req.session.userId, (error, user)=>{
              username = user.username;
              emailaddress = user.emailaddress;
              return res.render('index', {emailaddress: emailaddress, username: username, renderVideos: [{name:'searchresults', videos: result}]});
            }) 
          }
          else {
            return res.render('index',{renderVideos: [{name:'searchresults', videos: result}]});
          }
    })

});

module.exports = router;




