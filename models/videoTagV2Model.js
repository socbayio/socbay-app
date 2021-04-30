const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const videoElementSchema = new Schema(
    {
        videoId: {
            type: Schema.Types.ObjectId,
            ref: 'Video',
            required: true
        }
    },
    { _id : false }
);

const videoTagV2Schema = new Schema(
    {
        tagName: {
            type: String,
            required: true,
            unique: true
        },
        videos: [videoElementSchema],
        child: videoElementSchema
    }
);

const videoTagV2 = mongoose.model('videoTagV2', videoTagV2Schema);
module.exports = videoTagV2;