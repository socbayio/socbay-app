var express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware.js');
var router = express.Router({ mergeParams: true });
const User = require('../models/userModel.js');
const Video = require('../models/videoModel');
const uploadBlock = require('../models/uploadBlockModel');


router.get('/', getInfoIfAuthenticated, async (req, res, next) => {
    try {
        req.userInfo.userId = "6091872bb34b5058453d1e02"
        //req.userInfo.userId = "6093b8596714568b3c1dd146"

        const userFound = await User.findById(
            req.userInfo.userId
        ).populate(
            'uploadedFiles.blockId', 'currentInfo uploadedToNetwork'
        ).populate(
            'uploadedFiles.relatedVideo', 'title'
        ).populate(
            'uploadedVideos.videoId'
        );
        const uploadedFiles = [];
        const uploadedVideos = userFound.uploadedVideos.map((v) => v.videoId);
        let file = {};
        for (let fileCount = 0; fileCount < userFound.uploadedFiles.length; fileCount++) {
            file = {};
            file = await userFound.uploadedFiles[fileCount].subPopulate('fileId');
            file.blockInfo = userFound.uploadedFiles[fileCount].blockId;
            file.videoInfo = userFound.uploadedFiles[fileCount].relatedVideo || null; // Would be null if there is not related video
            uploadedFiles.push(file);
        }
        console.log(uploadedVideos)
        res.render('uploadHistory', { userInfo: req.userInfo, uploadedFiles, uploadedVideos });
    } catch (e) {

    }
});

module.exports = router;
