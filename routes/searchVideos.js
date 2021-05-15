var express = require('express');
var router = express.Router();
const Video = require('../models/videoModel.js');
const User = require('../models/userModel');

router.get('/', (req, res) => {
    try {
        var emailaddress = '';
        var username = '';
        Video.find({ $text: { $search: req.query.keyword } }, (error, result) => {
            if (req.session.userId) {
                User.findById(req.session.userId, (error, user) => {
                    username = user.username;
                    emailaddress = user.emailaddress;
                    return res.render('index', {
                        emailaddress: emailaddress,
                        username: username,
                        renderVideos: [{ name: 'searchresults', videos: result }],
                    });
                });
            } else {
                return res.render('index', {
                    renderVideos: [{ name: 'searchresults', videos: result }],
                });
            }
        });
    } catch (e) {
        console.error(`Error search page ${e}`);
    }
});

module.exports = router;
