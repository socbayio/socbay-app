const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const newVideosSchema = new Schema(
    {
        videoId: {
            type: String,
            required: true
        },
    },
    {
        capped: {size: 4096, max: 10, autoIndexId: true }
    }
);

const newVideos = mongoose.model('newVideos', newVideosSchema);
module.exports = newVideos;
