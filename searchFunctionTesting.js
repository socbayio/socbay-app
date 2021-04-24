const { getVideoDurationInSeconds } = require('get-video-duration')
const User = require('./models/userModel.js');
const newVideo = require('./models/newVideosModel.js');

const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const VideoSchema = new Schema({
    CID: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default: '/images/courses/img-1.jpg'
    },
    description: String,
    durationInSecond: Number,
    timestamp: {
        type: Number,
        default: Date.now
    },
    view: {
        type: Number,
        default: 0
    },
    like: {
        type: Number,
        default: 0
    },
    banned: {
        type: Boolean,
        default: false
    },
    author: {
        username: String,
        authorId: String
    }
});

VideoSchema.index({title: 'text'});

const Video = mongoose.model('Video',VideoSchema);

mongoose.connect("mongodb://34.96.245.194:27028/crustlive", {
    "auth": { "authSource": "admin" },
    "user": "ntn",
    "pass": "wv%nzw=VY$fMwV4",
    "useNewUrlParser": true
});

//Video.createIndexes();


Video.find({$text: {$search: 'fish'}}, (error,res)=>{console.log(error,res)})
