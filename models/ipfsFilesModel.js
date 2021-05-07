const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const IPFSFilesSchema = new Schema({
    typeFile: String,
    location: String,
    CID: String,
    fileSize: Number,
    expiredOnBlock: Number,
    replicas: Number,
    status: String,
    orderFee: Number,
    renewPoolBalance: Number,
    expiredOnDate: Date,
    uploadedDate: Date,
    wrappedFolder: String,
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
    },
});

const IPFSFile = mongoose.model('IPFSFile', IPFSFilesSchema);
module.exports = IPFSFile;
