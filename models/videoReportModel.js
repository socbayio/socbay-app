const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VideoReport = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reportCode: Number,
        descriptions: String,
        timestamp: {
            type: Number,
            default: Date.now,
        },
    },
    { _id: false }
);

const VideoReport = mongoose.model('VideoReport', VideoReport);

module.exports = VideoReport;
