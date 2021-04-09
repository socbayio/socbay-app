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
    thumbnail: String,
    description: String,
    durationInSecond: Number,
    date: Date,
    view: {
        type: Number,
        default: 0
    },
    like: {
        type: Number,
        default: 0
    },
    author: {
        username: String,
        emailaddress: String
    }
});

const Video = mongoose.model('Video',VideoSchema);
module.exports = Video;
