var express = require('express');
var router = express.Router();
const Video = require('../models/videoModel.js');
const User = require('../models/userModel');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');

router.get('/', getInfoIfAuthenticated, async (req, res) => {
    try {
        const result = await Video.find({ $text: { $search: req.query.keyword } });
        res.render('index', {
            userInfo: req.userInfo,
            renderVideos: [{ name: 'searchresults', videos: result }],
        });
    } catch (e) {
        console.error(`Error search page ${e}`);
    }
});

module.exports = router;
