const express = require('express');

const router = express.Router();
const { uploadFile } = require('../crust-socbay-pinner');
const logger = require('../logger').Logger;
const config = require('../config');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated');
const { pushFileToMe } = require('./common');

router.post('/', getInfoIfAuthenticated, async (req, res, next) => {
    try {
        const pinnedFile = await uploadFile(
            req.files.file_data,
            config.blockSizeLimitInByte
        );
        if (loggedIn) {
            await pushFileToMe(
                req.userInfo.userId,
                pinnedFile.fileId,
                pinnedFile.blockId,
                null
            );
        }
        res.send({ CID: pinnedFile.CID });
        res.end();
    } catch (e) {
        logger.error(`UniversalStore page fail with error: ${e}`);
        next(e);
    }
});

module.exports = router;
