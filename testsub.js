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
console.log(config);

mongoose.connect(config.dbServerUrl + 'socbay', config.userAuth);


const {uploadBlock, subFile} = require('./models/uploadBlockModel');
const Video = require('./models/videoModel');
const addFileInfo = async () => {
    const blockFound = await uploadBlock.findOne(
        { blockNumber: 37 },
    );
    var fileToPush = new subFile({fileName:"abc",fileSizeInByte:12,CID:"JOKDIJ"})
    //console.log(blockFound)
    //console.log(subFile)
    blockFound.filesInfo.push(fileToPush);
    blockFound.save()
    //await uploadTotalSizeInByte(blockNumber, fileSizeInByte);
    //await uploadFilesNumber(blockNumber, 1);
    return {blockId: blockFound._id, fileId: fileToPush._id}
};

//const ab = addFileInfo()
//ab.then((v)=>{console.log(v)})
const ab = Video.findById('609fc371cbc5963ba861377f').populate('networkStatus.blockId')
ab.then(async (v)=>{
    //console.log(v)
   // let a = await v.subPopulate('fileId')
    let b = v.networkStatus;
    let c = await b.subPopulate('fileId');
    console.log(b)
    console.log(c)
    

})