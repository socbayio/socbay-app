var express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware.js');
var router = express.Router({ mergeParams: true });
const User = require('../models/userModel.js');
const Video = require('../models/videoModel');
const uploadBlock = require('../models/uploadBlockModel');
var logger = require("../logger").Logger;


router.get('/', redirectIfNotAuthenticatedMiddleware, getInfoIfAuthenticated, async (req, res, next) => {
    try {
        const userFound = await User.findById(
            req.userInfo.userId
        ).populate(
            'uploadedFiles.blockId', 'currentInfo uploadedToNetwork'
        ).populate(
            'uploadedFiles.relatedVideo', 'title'
        ).populate(
            {
                path: 'uploadedVideos.videoId',
                populate: {
                    path: "blockId",
                    select: "currentInfo uploadedToNetwork",
                }
            
            }
        );
        const uploadedFiles = [];
        const uploadedVideos = await Promise.all(userFound.uploadedVideos.map(async (video) => {
                await video.videoId.subPopulate('fileId');
                return video.videoId;
            })
        )

        let file = {};
        for (let fileCount = 0; fileCount < userFound.uploadedFiles.length; fileCount++) {
            file = {};
            file = await userFound.uploadedFiles[fileCount].subPopulate('fileId');
            file.blockInfo = userFound.uploadedFiles[fileCount].blockId;
            file.videoInfo = userFound.uploadedFiles[fileCount].relatedVideo || null; // Would be null if there is not related video
            uploadedFiles.push(file);
        }

        res.render('uploadHistory', { userInfo: req.userInfo, uploadedFiles, uploadedVideos });
    } catch (e) {
        logger.error(`Error found on uploadhistory.js ${e}`);
        next()
    }
});

module.exports = router;
