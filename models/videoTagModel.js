const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const videoTagSchema = new Schema(
    {
        tagName: {
            type: String,
            required: true,
            unique: true
        },
        videos: []
    }
);

const videoTag = mongoose.model('videoTag', videoTagSchema);
module.exports = videoTag;
