const mongoose = require('mongoose');

const { Schema } = mongoose;

const videoElementSchema = new Schema(
    {
        videoId: {
            type: Schema.Types.ObjectId,
            ref: 'Video',
            required: true,
        },
        lang: String,
        timestamp: {
            type: Number,
            default: Date.now,
        },
    },
    { _id: false }
);

const videoTagSchema = new Schema({
    tagName: {
        type: String,
        required: true,
        unique: true,
    },
    videos: [videoElementSchema],
    child: videoElementSchema,
});

const videoTag = mongoose.model('videoTag', videoTagSchema);
module.exports = videoTag;
