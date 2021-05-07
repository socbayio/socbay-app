const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fileInfoSchema = new Schema({
    fileName: String,
    fileSizeInByte: Number,
    CID: String,
});

const uploadBlockSchema = new Schema({
    blockNumber: {
        type: Number,
        unique: true,
    },
    CID: String,
    timeStamp: Number,
    uploadedBy: Number,
    uploadedFilesNumber: Number,
    totalSizeInByte: Number,
    orderFee: Number,
    currentInfo: {
        expiredOnBlockHeight: Number,
        replicas: Number,
        status: String,
        renewPoolBalance: Number,
    },
    filesInfo: [fileInfoSchema],
    uploadedToNetwork: {
        type: Boolean,
        default: false,
    },
});

const uploadBlock = mongoose.model('uploadBlock', uploadBlockSchema);
module.exports = uploadBlock;
