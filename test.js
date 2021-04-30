const User = require('./models/userModel.js');
const Video = require('./models/videoModel.js');
const newVideo = require('./models/newVideosModel.js');
//const videoTag = require('./models/videoTagModel.js');
const liveChat = require('./models/liveChatModel')
//const videoTagV2 = require('./models/videoTagV2Model');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27028/socbay", {
    "auth": { "authSource": "admin" },
    "user": "ntn",
    "pass": "wv%nzw=VY$fMwV4",
    "useNewUrlParser": true
});

const videoElementSchema = new Schema(
    {
        videoId: {
            type: Schema.Types.ObjectId,
            ref: 'Video',
            required: true
        }
    },
    { _id : false }
);

const userElementSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { _id : false }
);

const videoTagSchema = new Schema(
    {
        tagName: {
            type: String,
            required: true,
            unique: true
        },
        videos: [videoElementSchema],
        sub: [userElementSchema]
        //child: videoElementSchema
    }
);

const videoTag = mongoose.model('videoTag55', videoTagSchema);

//videoTag.create({tagName:'tagtag7'})
const abc = videoTag.updateOne({tagName:'tagtag7'},{ $push: { sub: {userId:'6073345a0f696b3e8cd1946d'}} })
abc.then((value)=>{console.log(value)})


// const videoTagV2 = mongoose.model('videoTagV5', videoTagV2Schema);

// //videoTagV2.create({tagName: 'tagname5', videos: [{videoId: '60732e8df7fe381343f254a0'}]})

// const xxx = videoTagV2.updateOne({tagName:'tagname5'},{ $push: { videos: {videoId:'6073345a0f696b3e8cd1946d'}} })
// xxx.then((value)=>{console.log(value)})
// // const abc = videoTagV2.findById('608b1b3a88b3a91be4436e8d').populate('videos.videoId')

// abc.then((value)=>{
//     console.log(value)
//     console.log(value.videos[2].videoId)
// })


