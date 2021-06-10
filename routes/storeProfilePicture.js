const express = require('express');

const router = express.Router();
const logger = require('../logger').Logger;
const config = require('../config');
const User = require('../models/userModel');

const { pushFileToMe } = require('./common');

const { uploadFile } = require('../crust-socbay-pinner');

const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated');

const filesValidation = async (req, res, next) => {
    try {
        if (req.files.profilepicture.mimetype.includes('image')) {
            next();
        } else {
            logger.error('There is hacker');
            return res.send({});
        }
    } catch (e) {
        logger.error('There is hacker');
        return res.send({});
    }
};

router.post(
    '/',
    redirectIfNotAuthenticatedMiddleware,
    getInfoIfAuthenticated,
    filesValidation,
    async (req, res, next) => {
        try {
            const profilePicture = await uploadFile(
                req.files.profilepicture,
                config.blockSizeLimitInByte
            );
            User.findByIdAndUpdate(req.userInfo.userId, {
                profilePicture: profilePicture.CID,
            }).then();
            pushFileToMe(
                req.userInfo.userId,
                profilePicture.fileId,
                profilePicture.blockId,
                null
            );
            res.send({ CID: profilePicture.CID });
        } catch (e) {
            logger.error(`Error in storeVideo.js: ${e}`);
        }
    }
);

module.exports = router;
