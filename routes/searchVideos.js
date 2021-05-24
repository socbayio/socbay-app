var express = require('express');
var router = express.Router();
const Video = require('../models/videoModel.js');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const logger = require('../logger').Logger;
const User = require('../models/userModel');

router.get('/', getInfoIfAuthenticated, async (req, res) => {
    try {
        const result = await Video.find({$text: {$search: req.query.keyword}})
            .populate('thumbnail.blockId', 'uploadedToNetwork CID');
        
        await Promise.all(result.map(async (video) =>{
            await video.thumbnail.subPopulate('fileId');
            return video;
        }));

        res.render('index', {
            userInfo: req.userInfo,
            renderVideos: [{ name: 'searchresults', videos: result }],
        });
    } catch (e) {
        logger.error(`Error search page ${e}`);
    }
});

module.exports = router;
