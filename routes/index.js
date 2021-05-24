var express = require('express');
var router = express.Router();
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const logger = require('../logger').Logger;

const { getVideoFromTagByLanguage } = require('./common.js');

function callback(tagName) {
    return getVideoFromTagByLanguage(
        tagName,
        this.lang,
        this.videosNumber,
        this.skippedVideos
    );
}

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
        const lang = req.currentLang;
        const promises = homepageTags.map(callback, {
            lang: lang,
            videosNumber: 20,
            skippedVideos: 0,
        });
        const values = await Promise.all(promises);
        res.render('index', {
            userInfo: req.userInfo,
            renderVideos: values.filter((x) => x !== undefined),
        });
    } catch (e) {
        logger.error(`Index page fail with error: ${e}`);
        next(e);
    }
});

module.exports = router;
