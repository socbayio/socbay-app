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
          
            const uploadedVideos = await Promise.all(userFound.uploadedVideos.map(async (video) => {
                    await video.videoId.networkStatus.subPopulate('fileId');
                    //console.log(video.videoId)
                    return {
                        fileId: video.videoId.networkStatus.fileId, 
                        blockId: video.videoId.networkStatus.blockId,
                        title: video.videoId.title
                    };
                })
            )
    
            let file = {};
            const uploadedFiles = [];
            //console.log(userFound.uploadedFiles)
            for (let fileCount = 0; fileCount < userFound.uploadedFiles.length; fileCount++) {
                file = {};
                file = await userFound.uploadedFiles[fileCount].subPopulate('fileId');
                //console.log(file)
                //file.blockInfo = userFound.uploadedFiles[fileCount].blockId;
                //file.videoInfo = userFound.uploadedFiles[fileCount].relatedVideo || null; // Would be null if there is not related video
                uploadedFiles.push(file);
            }
            console.log("uploadedfile")
            console.log(uploadedFiles)

            res.render('uploadHistory', { userInfo: req.userInfo, uploadedFiles, uploadedVideos });
        } catch (e) {
            logger.error(`Error found on uploadhistory.js ${e}`);
            next()
        }
    }
);

module.exports = router;
