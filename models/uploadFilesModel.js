const mongoose = require('mongoose');

const { Schema } = mongoose;

const uploadFileSchema = new Schema({
    blockNumber: {
        type: Number,
        unique: true,
    },
    CID: String,
    timeStamp: Number,
    uploadedBy: Number,
    uploadedFilesNumber: Number,
    totalSizeInByte: {
        type: Number,
        default: 0,
    },
    orderFee: Number,
    currentInfo: {
        expiredOnBlockHeight: Number,
        expiredOnDate: Date,
        replicas: Number,
        status: String,
        renewPoolBalance: Number,
    },
    uploadedToNetwork: {
        type: Boolean,
        default: false,
    },
});

const uploadFile = mongoose.model('uploadFile', uploadFileSchema);
module.exports = { uploadFile };
