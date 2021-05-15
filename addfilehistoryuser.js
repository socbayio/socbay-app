var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config');

/**
  MongooseDB
 */
const mongoose = require('mongoose');
const expressSession = require('express-session');
const flash = require('connect-flash');
const User = require('./models/userModel.js');
const uploadBlock = require('./models/uploadBlockModel')
const Video = require('./models/videoModel')

mongoose.connect(config.dbServerUrl + 'socbay', config.userAuth);

/* User.findByIdAndUpdate(
    "6091872bb34b5058453d1e02",
    { $push: { uploadedFiles: { fileId: "60919636f3c4935d114fa11a" } } },
    (err,user)=>{console.log(err,user)}    
) */

/* const a = User.findById(
    "6091872bb34b5058453d1e02"
    //"6093b8596714568b3c1dd146"
).populate(
    'uploadedFiles.blockId', 'currentInfo uploadedToNetwork'
).populate(
    'uploadedFiles.relatedVideo', 'title'
).populate(
    'uploadedVideos.videoId'
);


a.then(async (user)=>{
        //await user.uploadedFiles[0].subPopulate('fileId')
        //const b = await a.subPopulate('fileId')
        //console.log(a)
        console.log(user)
        

        //console.log(b)  
})
.catch (
    (e)=>{console.log(e)}
) */
const userfound = User.findById("609aa0011fc122ea787c9e84")
.populate(
    {
        path: 'uploadedVideos.videoId',
        populate: {
            path: "blockId",
        }
    
    }
);

userfound.then(async (v)=>{
    console.log(v)
    a = v.uploadedVideos[0].videoId;
    const b = await a.subPopulate('fileId')
    console.log(a)
    console.log(b)
    //console.log(v.uploadedVideos[0].videoId)
})



// const videofound = Video.findById("60918805b34b5058453d1e0f")
// .populate('blockId', 'currentInfo uploadedToNetwork');

// videofound.then(async (v)=>{
//     await v.subPopulate('fileId')
//     console.log(v)

// })