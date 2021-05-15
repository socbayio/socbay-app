const mongoose = require('mongoose');
const subReferencesPopulate = require('mongoose-sub-references-populate');

const Schema = mongoose.Schema;

const networkStatusSchema = new Schema(
    {
        networkName: String,
        CID: String,
        blockId: {
            type: Schema.Types.ObjectId,
            ref: 'uploadBlock',
        },
        fileId: {
            type: Schema.Types.ObjectId,
            subRef: 'uploadBlock.filesInfo',
        },
        expiredOnBlock: Number,
        expiredOnDate: Date,
        replicas: Number,
        status: String,
        orderFee: Number,
        renewPoolBalance: Number
    },
    { _id: false }
)

const VideoSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
    },
    lang: String,
    description: String,
    durationInSecond: {
        type: Number,
        default: 0,
    },
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
    fileId: {
        type: Schema.Types.ObjectId,
        subRef: 'uploadBlock.filesInfo',
    },
    networkStatus: {
        type: networkStatusSchema
    },
    /* networkStatus: {
        networkName: String,
        CID: String,
        blockId: {
            type: Schema.Types.ObjectId,
            ref: 'uploadBlock',
        },
        fileId: {
            type: Schema.Types.ObjectId,
            subRef: 'uploadBlock.filesInfo',
        },
        expiredOnBlock: Number,
        expiredOnDate: Date,
        replicas: Number,
        status: String,
        orderFee: Number,
        renewPoolBalance: Number,
    }, */
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

VideoSchema.index({ title: 'text', description: 'text' });
networkStatusSchema.plugin(subReferencesPopulate);

const Video = mongoose.model('Video', VideoSchema);
module.exports = Video;
