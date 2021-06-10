const express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated');

const router = express.Router({ mergeParams: true });
const { getVideosChannel } = require('./common');

router.get('/', getInfoIfAuthenticated, async (req, res, next) => {
    try {
        const channelInfo = await getVideosChannel(req.params.channelId);
        res.render('channel', {
            channelInfo,
            userInfo: req.userInfo,
        });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
