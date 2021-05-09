const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const VideoSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
    },
    description: String,
    durationInSecond: Number,
    timestamp: {
        type: Number,
        default: Date.now,
    },
    fileUploadStatus: {
        type: String, // Successful|Pending|Failed
    },
    view: {
        type: Number,
        default: 0,
    },
    like: {
        type: Number,
        default: 0,
    },
    isBanned: {
        status: {
            type: Boolean,
            default: false,
        },
        reason: String,
    },
    fileSize: Number,
    networkStatus: {
        networkName: String,
        CID: String,
        expiredOnBlock: Number,
        expiredOnDate: Date,
        replicas: Number,
        status: String,
        orderFee: Number,
        renewPoolBalance: Number,
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

VideoSchema.index({ title: 'text', description: 'text' });

const Video = mongoose.model('Video', VideoSchema);
module.exports = Video;
