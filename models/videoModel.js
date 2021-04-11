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
    date: Date,
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

const Video = mongoose.model('Video',VideoSchema);
module.exports = Video;
