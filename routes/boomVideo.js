const express = require('express');

const router = express.Router({ mergeParams: true });
const Video = require('../models/videoModel');

router.post('/', async (req, res, next) => {
    try {
        await Video.findByIdAndUpdate(req.params.videoId, {
            $inc: { like: 1 },
        });
        res.end();
    } catch (e) {
        next(e);
    }
});

module.exports = router;
