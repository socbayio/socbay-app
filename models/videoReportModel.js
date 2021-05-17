const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VideoReporSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reportCode: String,
    descriptions: String,
    timestamp: {
        type: Number,
        default: Date.now,
    },
});

const VideoReport = mongoose.model('VideoReport', VideoReporSchema);

module.exports = VideoReport;
