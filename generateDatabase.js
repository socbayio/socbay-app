const mongoose = require('mongoose');
const video = require('./models/videoModel');
const user = require('./models/userModel')
const liveChat = require('./models/liveChatModel');
const uploadBlock = require('./models/uploadBlockModel')
const globalConfig = require('./models/globalConfigModel')
mongoose.connect("mongodb://34.92.155.214:27028/socbay", {
    "auth": { "authSource": "admin" },
    "user": "ntn",
    "pass": "wv%nzw=VY$fMwV4",
    "useNewUrlParser": true
});

globalConfig.create({variableName:"updateblock", currentBlock:6});

// liveChat.findOne({channel:'global'},(error,res)=>{
//     if (!res){
//         liveChat.create({channel:'global'});
//     }
// })

// global.findOne({variableName:'updateblock'},(error,res)=>{
//     if (!res){
//         global.create({variableName:'updateblock',currentBlock:0});
//     }
// })

// uploadBlock.findOne({blockNumber:3},(error,res)=>{
//     if (!res){
//         uploadBlock.create({totalSizeInByte:0,blockNumber:3,filesInfo:[]});
//     }
// })


