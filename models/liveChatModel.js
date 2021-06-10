const mongoose = require('mongoose');

const { Schema } = mongoose;

const liveChatSchema = new Schema({
    channel: {
        type: String,
        required: true,
        unique: true,
    },
    messages: [],
});

const liveChat = mongoose.model('liveChat', liveChatSchema);
module.exports = liveChat;
