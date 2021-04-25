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
        type: String
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

VideoSchema.index({title: 'text', description: 'text'});

const Video = mongoose.model('Video',VideoSchema);
module.exports = Video;
