var express = require('express');
var router = express.Router();
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');

const { getVideoFromTagByLanguage } = require('./common.js');

function callback(tagName) {
    return getVideoFromTagByLanguage(
        tagName,
        this.lang,
        this.videosNumber,
        this.skippedVideos
    );
}

var middleware = require('i18next-express-middleware');
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
        const lang = req.language;
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
        console.error(`Index page fail with error: ${e}`);
        next(e);
    }
});

module.exports = router;
