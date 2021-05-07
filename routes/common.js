const videoTag = require('../models/videoTagModel.js');
const Video = require('../models/videoModel.js');
const User = require('../models/userModel.js');
const uploadBlock = require('../models/uploadBlockModel');
const global = require('../models/globalModel');

const { spawn } = require('child_process');

const getVideosFromTag = async (tagName) => {
    const tagFound = await videoTag.findOne({ tagName: tagName });
    if (tagFound) {
        var videoArray = [];
        let video = {};
        for (
            let videoCount = 0;
            videoCount < tagFound.videos.length;
            videoCount++
        ) {
            try {
                video = await Video.findById(tagFound.videos[videoCount]);
                if (video) {
                    videoArray.push(video);
                }
            } catch (e) {} // ignore error | error could be wrong from of addr |..
        }
        return { name: tagName, videos: videoArray };
    }
    return;
};

const getVideosFromTagPromiseStyleOld = async (tagName) => {
    const tagFound = await videoTag.findOne({ tagName: tagName });
    if (tagFound) {
        const promises = tagFound.videos.map((videoId) =>
            Video.findById(videoId)
        );
        const results = await Promise.allSettled(promises);
        const videoArray = results
            .filter((p) => p.status === 'fulfilled')
            .map((v) => v.value)
            .filter((x) => x !== null);
        return { name: tagName, videos: videoArray };
    }
    return;
};

const getVideosFromTagPromiseStyle = async (tagName) => {
    const tagFound = await videoTag
        .findOne({ tagName: tagName })
        .populate('videos.videoId');
    if (tagFound) {
        videoArray = [];
        for (
            let videoCount = 0;
            videoCount < tagFound.videos.length;
            videoCount++
        ) {
            videoArray.push(tagFound.videos[videoCount].videoId);
        }
        return { name: tagName, videos: videoArray };
    }
    return;
};

const getVideosChannelOld = async (channelId) => {
    const userFound = await User.findById(channelId);
    if (userFound) {
        const promises = userFound.uploadedVideos.map((videoId) =>
            Video.findById(videoId)
        );
        const results = await Promise.allSettled(promises);
        const videoArray = results
            .filter((p) => p.status === 'fulfilled')
            .map((v) => v.value)
            .filter((x) => x !== null);
        channelInfo = {
            uploadedVideos: videoArray,
            profilePicture: userFound.profilePicture,
            username: userFound.username,
        };
        return channelInfo;
    } else {
        throw new Error('Channel not found');
    }
};

const getVideosChannel = async (channelId) => {
    const userFound = await User.findById(channelId).populate(
        'uploadedVideos.videoId'
    );

    if (userFound) {
        channelInfo = {
            uploadedVideos: userFound.uploadedVideos.map((v) => v.videoId),
            profilePicture: userFound.profilePicture,
            username: userFound.username,
        };
        return channelInfo;
    } else {
        throw new Error('Channel not found');
    }
};

const pushVideoToTag = async (tagName, videoId) => {
    const videoTagFound = await videoTag.findOneAndUpdate(
        { tagName: tagName },
        { $push: { videos: { videoId: videoId } } }
    );
    if (!videoTagFound) {
        videoTag.create({ tagName: tagName, videos: [{ videoId: videoId }] });
    }
};

const pushVideoToMe = async (myId, videoId) => {
    const videoTagFound = await User.findOneAndUpdate(
        { _id: myId },
        { $push: { uploadedVideos: { videoId: videoId } } }
    );
};

const uploadFilesNumber = async (blockNumber, numberAddedFiles) => {
    const blockFound = await uploadBlock.findOneAndUpdate(
        { blockNumber: blockNumber },
        { $inc: { uploadedFilesNumber: numberAddedFiles } }
    );
};
const uploadTotalSizeInByte = async (blockNumber, totalSizeInByteAdded) => {
    const blockFound = await uploadBlock.findOneAndUpdate(
        { blockNumber: blockNumber },
        { $inc: { totalSizeInByte: totalSizeInByteAdded } }
    );
};
const addFileInfo = async (blockNumber, fileName, fileSizeInByte, CID) => {
    const blockFound = await uploadBlock.findOneAndUpdate(
        { blockNumber: blockNumber },
        { $push: { filesInfo: { fileName, fileSizeInByte, CID } } }
    );
    await uploadTotalSizeInByte(blockNumber, fileSizeInByte);
    await uploadFilesNumber(blockNumber, 1);
};

var addFileToIPFSPromise = function (pathFile) {
    return new Promise(function (resolve, reject) {
        pathFile = '"' + pathFile + '"';
        const addToIPFS = spawn('ipfs', ['add', pathFile], { shell: true });

        var mergeData = '';
        addToIPFS.stdout.on('data', (data) => {
            mergeData += data;
        });

        var mergeError = '';
        addToIPFS.stderr.on('data', (data) => {
            mergeError += data;
        });

        addToIPFS.on('close', (code) => {
            if (code == 0) {
                var searchCID = mergeData.match(/added\s([a-zA-Z0-9]*)\s/);
                if (searchCID[1]) {
                    resolve(searchCID[1]);
                } else {
                    reject(mergeData + mergeError);
                }
            } else {
                reject(mergeError);
            }
        });
    });
};

module.exports = {
    getVideosFromTag,
    getVideosFromTagPromiseStyle,
    getVideosChannel,
    pushVideoToTag,
    pushVideoToMe,
    uploadFilesNumber,
    uploadTotalSizeInByte,
    addFileInfo,
    addFileToIPFSPromise,
};
