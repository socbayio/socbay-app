var express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware.js');
var router = express.Router();
const User = require('../models/userModel');
var logger = require("../logger").Logger;

router.get('/',
    redirectIfNotAuthenticatedMiddleware,
    getInfoIfAuthenticated,
    async function (req, res, next) {
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
                        path: "networkStatus.blockId",
                        select: "currentInfo uploadedToNetwork",
                    }
                }
            );
          
            const uploadedVideosRaw = await Promise.all(userFound.uploadedVideos.map(async (video) => {
                if (!video.videoId.isDeleted) {
                    await video.videoId.networkStatus.subPopulate('fileId');
                    return {
                        videoId: video.videoId._id,
                        fileId: video.videoId.networkStatus.fileId, 
                        blockId: video.videoId.networkStatus.blockId,
                        title: video.videoId.title
                    };
                }
                return null; 
            }))
            const uploadedVideos = uploadedVideosRaw.filter((x) => x !== null);
            let file = {};
            const uploadedFiles = [];
            for (let fileCount = 0; fileCount < userFound.uploadedFiles.length; fileCount++) {
                file = {};
                file = await userFound.uploadedFiles[fileCount].subPopulate('fileId');
                uploadedFiles.push(file);
            }
            console.log(uploadedVideos);
            res.render('uploadHistory', { userInfo: req.userInfo, uploadedFiles, uploadedVideos });
        } catch (e) {
            logger.error(`Error found on uploadhistory.js ${e}`);
            next()
        }
    }
);

module.exports = router;
