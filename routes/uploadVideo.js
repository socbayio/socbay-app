var express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const redirectIfNotAuthenticatedMiddleware = require('../middleware/redirectIfNotAuthenticatedMiddleware.js');
var router = express.Router();
const User = require('../models/userModel.js');

const { addFileInfo, addFileToIPFSPromise } = require('./common');
const {
    uploadBlockToCrust,
    createNewBlock,
} = require('../crust-socbay-pinner');
const path = require('path');
const fs = require('fs');

router.get(
    '/',
    //redirectIfNotAuthenticatedMiddleware,
    getInfoIfAuthenticated,
    function (req, res, next) {
        res.render('uploadVideo', { userInfo: req.userInfo });
    }
);

async function saveThums(req, res, next) {
    try {
        const thumbnail = req.files.thumbnail;
        // pass to next middleware if no thumbnail
        if (!thumbnail) next();

        let savingPath = path.resolve(
            __dirname,
            '..',
            'public/images/thumbnails',
            thumbnail.name
        );
        await thumbnail.mv(savingPath);
    } catch (error) {
        req.uploadResult.error.push(error.message);
    } finally {
        next();
    }
}

async function saveVideo(req, res, next) {
    try {
        const video = req.files.video;
        if (!video) next();

        let localCurrentBlock = {
            totalSize: globalCurrentBlock.totalSize,
            blockNumber: globalCurrentBlock.blockNumber,
        };
        globalCurrentBlock.totalSize += video.size;
        if (globalCurrentBlock.totalSize > 100 * 1024 * 1024) {
            globalCurrentBlock.blockNumber++;
            globalCurrentBlock.totalSize = 0;
            createNewBlock();
        }

        let savingPath = path.resolve(
            __dirname,
            '..',
            'public/videos',
            localCurrentBlock.blockNumber.toString(),
            video.name
        );
        await video.mv(savingPath);

        const CIDOutput = await addFileToIPFSPromise(savingPath);
        addFileInfo(
            localCurrentBlock.blockNumber,
            video.name,
            video.size,
            output
        );
        if (localCurrentBlock.totalSize + video.size > 100 * 1024 * 1024) {
            uploadBlockToCrust(
                config.crustPrivateKey,
                localCurrentBlock.blockNumber
            );
        }

        req.uploadResult.CID = CIDOutput;
    } catch (error) {
        req.uploadResult.error.push(error.message);
    } finally {
        next();
    }
}

function prepareResult(req, res, next) {
    req.uploadResult = {
        state: '',
        CID: '',
        error: [],
    };
    next();
}

function returnResponse(req, res, next) {
    if (req.uploadResult.error.length === 0) req.uploadResult.state = 'ok';
    res.send({ res: req.uploadResult });
}

router.post(
    '/testUploadFiles',
    redirectIfNotAuthenticatedMiddleware,
    getInfoIfAuthenticated,
    prepareResult,
    saveThums,
    saveVideo,
    returnResponse
);

module.exports = router;
