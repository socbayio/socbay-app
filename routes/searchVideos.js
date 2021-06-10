const express = require('express');

const router = express.Router();
const Video = require('../models/videoModel');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated');
const logger = require('../logger').Logger;

router.get('/', getInfoIfAuthenticated, async (req, res) => {
    try {
        const result = await Video.find({
            $text: { $search: req.query.keyword },
        }).populate('thumbnail.blockId', 'uploadedToNetwork CID');

        await Promise.all(
            result.map(async (video) => {
                await video.thumbnail.subPopulate('fileId');
                return video;
            })
        );

        res.render('index', {
            userInfo: req.userInfo,
            renderVideos: [{ name: 'searchresults', videos: result }],
        });
    } catch (e) {
        logger.error(`Error search page ${e}`);
    }
});

module.exports = router;
