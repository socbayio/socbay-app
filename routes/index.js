const express = require('express');

const router = express.Router();
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated');
const logger = require('../logger').Logger;

const { getVideoFromTagByLanguage } = require('./common');

function callback(tagName) {
    return getVideoFromTagByLanguage(
        tagName,
        this.lang,
        this.videosNumber,
        this.skippedVideos
    );
}

router.get('/', getInfoIfAuthenticated, async (req, res, next) => {
    try {
        const homepageTags = [
            'newvideos',
            'gaming',
            'relax',
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
            lang,
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
