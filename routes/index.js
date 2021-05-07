var express = require('express');
var router = express.Router();
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');

const { getVideosFromTagPromiseStyle } = require('./common.js');

router.get('/', getInfoIfAuthenticated, async function (req, res, next) {
    try {
        homepageTags = [
            'newvideos',
            'gaming',
            'tech',
            'finance',
            'cryptonews',
            'news',
            'lifestyle',
            'healthandfitness',
            'music',
        ];

        const promises = homepageTags.map(getVideosFromTagPromiseStyle);
        const values = await Promise.all(promises);
        res.render('index', {
            userInfo: req.userInfo,
            renderVideos: values.filter((x) => x !== undefined),
        });
    } catch (e) {
        console.error(`Index page fail with error: ${e}`);
        next(e);
    }
});

module.exports = router;
