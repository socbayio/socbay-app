const videoTag = require('../models/videoTagModel.js');
const Video = require('../models/videoModel.js');
const User = require('../models/userModel.js');
const { uploadBlock, subFile } = require('../models/uploadBlockModel');

//const uploadBlock = require('../models/uploadBlockModel');
const globalConfig = require('../models/globalConfigModel');

const { spawn } = require('child_process');

// Video tasks
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

const getVideoFromTagByLanguage = async (
    tagName,
    lang,
    videosNumber,
    skippedVideos
) => {
    const pipeline = [
        {
            $match: {
                tagName: tagName,
                'videos.lang': lang,
            },
        },
        {
            $unwind: '$videos',
        },
        {
            $match: {
                'videos.lang': lang,
            },
        },
        {
            $sort: {
                'videos.timestamp': -1,
            },
        },
        {
            $skip: skippedVideos,
        },
        {
            $limit: videosNumber,
        },
        {
            $group: {
                _id: '$_id',
                videos: {
                    $push: '$videos',
                },
            },
        },
    ];
    let tagFound = await videoTag.aggregate(pipeline);
    if (tagFound.length) {
        await Video.populate(tagFound, {
            path: 'videos.videoId',
        });
        await uploadBlock.populate(tagFound, {
            path: 'videos.videoId.thumbnail.blockId',
            select: 'uploadedToNetwork CID'
        })

        let videoArray = [];
        for (
            let videoCount = 0;
            videoCount < tagFound[0].videos.length;
            videoCount++
        ) {
            await tagFound[0].videos[videoCount].videoId.thumbnail.subPopulate('fileId');
            if (tagFound[0].videos[videoCount].videoId.thumbnail.blockId.uploadedToNetwork) {
                const link = 
                    tagFound[0].videos[videoCount].videoId.thumbnail.blockId.CID +
                    '/' +
                    tagFound[0].videos[videoCount].videoId.thumbnail.fileId.fileName;
                tagFound[0].videos[videoCount].videoId.thumbnail = { link };
            } else {
                const link = tagFound[0].videos[videoCount].videoId.thumbnail.fileId.CID;
                tagFound[0].videos[videoCount].videoId.thumbnail  = { link };
            }
            videoArray.push(tagFound[0].videos[videoCount].videoId);
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
        { 
            path: 'uploadedVideos.videoId',
            populate: {
                path: 'thumbnail.blockId',
                select: 'uploadedToNetwork CID'
            }
        }
    );

    if (userFound) {
        channelInfo = {
            uploadedVideos: await Promise.all(userFound.uploadedVideos.map( async (video) => {
                await video.videoId.thumbnail.subPopulate('fileId');
                if (video.videoId.thumbnail.blockId.uploadedToNetwork) {
                    video.videoId.thumbnail = {
                        link: video.videoId.thumbnail.blockId.CID + '/' + video.videoId.thumbnail.fileId.fileName
                    }
                } else {
                    video.videoId.thumbnail = {
                        link: video.videoId.thumbnail.fileId.CID
                    }
                }
                return video.videoId;
            })),
            profilePicture: userFound.profilePicture,
            username: userFound.username,
        };
        console.log(channelInfo.uploadedVideos)
        return channelInfo;
    } else {
        throw new Error('Channel not found');
    }
};

const pushVideoToTag = async (tagName, videoId, lang) => {
    const videoTagFound = await videoTag.findOneAndUpdate(
        { tagName: tagName },
        { $push: { videos: { videoId, lang } } }
    );
    if (!videoTagFound) {
        videoTag.create({ tagName: tagName, videos: [{ videoId, lang }] });
    }
};

const pushVideoToMe = async (myId, videoId, lang) => {
    const videoTagFound = await User.findOneAndUpdate(
        { _id: myId },
        { $push: { uploadedVideos: { videoId, lang } } }
    );
};

const pushFileToMe = async (myId, fileId, blockId, videoId) => {
    const videoTagFound = await User.findOneAndUpdate(
        { _id: myId },
        { $push: { uploadedFiles: { fileId, blockId, relatedVideo: videoId } } }
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
    const blockFound = await uploadBlock.findOne(
        { blockNumber: blockNumber }
    );
    var fileToPush = new subFile({fileName, fileSizeInByte, CID})
    blockFound.filesInfo.push(fileToPush);
    blockFound.save();
    await uploadTotalSizeInByte(blockNumber, fileSizeInByte);
    await uploadFilesNumber(blockNumber, 1);
    return {blockId: blockFound._id, fileId: fileToPush._id}
};

// User tasks
const getAllUsers = async () => {
    const users = await User.find();

    const usersReturning = [];
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        usersReturning.push({
            id: user._id,
            username: user.username,
            profilePicture: user.profilePicture,
            emailaddress: user.emailaddress,
        });
    }

    return usersReturning;
};

const getUserById = async (userId) => {
    const userFound = await User.findById(userId);
    return userFound;
};

const isEmptyObject = (obj) =>
    Object.keys(obj).length === 0 && obj.constructor === Object;



module.exports = {
    getVideosFromTag,
    getVideosFromTagPromiseStyle,
    getVideosChannel,
    pushVideoToTag,
    pushVideoToMe,
    uploadFilesNumber,
    uploadTotalSizeInByte,
    addFileInfo,
    getVideoFromTagByLanguage,
    pushFileToMe,
    getAllUsers,
    isEmptyObject,
};
