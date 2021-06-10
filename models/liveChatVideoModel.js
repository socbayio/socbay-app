const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema(
    {
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        message: String,
    },
    { _id: false }
);

const liveChatVideoSchema = new Schema({
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
    },
    messages: [messageSchema],
});

const liveChatVideo = mongoose.model('liveChatVideo', liveChatVideoSchema);
module.exports = liveChatVideo;
