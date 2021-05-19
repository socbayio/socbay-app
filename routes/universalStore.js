var express = require('express');
var router = express.Router();
const { uploadFile } = require('../crust-socbay-pinner');
const logger = require("../logger").Logger;
const config = require("../config.js");
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const {
    pushFileToMe,
} = require('./common');

router.post('/', getInfoIfAuthenticated, async function (req, res, next) {
    try {
        const pinnedFile = await uploadFile(req.files.file_data, config.blockSizeLimitInByte);
        if (loggedIn) {
            await pushFileToMe(req.userInfo.userId, pinnedFile.fileId, pinnedFile.blockId, null);
        }
        res.send({CID: pinnedFile.CID});
        res.end();
    } catch (e) {
        logger.error(`UniversalStore page fail with error: ${e}`);
        next(e);
    }
});

module.exports = router;
