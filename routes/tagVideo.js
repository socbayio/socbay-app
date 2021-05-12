var express = require('express');
var router = express.Router({ mergeParams: true });
const User = require('../models/userModel.js');
const Video = require('../models/videoModel.js');
const videoTag = require('../models/videoTagModel.js');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated');
const { getVideoFromTagByLanguage } = require('./common.js');

router.get('/', getInfoIfAuthenticated, async function (req, res, next) {
    try {
        const values = [await getVideoFromTagByLanguage(req.params.tagId, req.currentLang, 20, 0)];
        res.render('index', {
            userInfo: req.userInfo,
            renderVideos: values.filter((x) => x !== undefined),
        });
    } catch (e) {
        console.error(`Tag page fail with error: ${e}`);
        next(e);
    }
});

module.exports = router;
