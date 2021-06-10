const mongoose = require('mongoose');

const { Schema } = mongoose;

const visiterInfo = new Schema(
    {
        ip: String,
        location: {},
        headers: {},
        timestamp: {
            type: Number,
            default: Date.now,
        },
    },
    { _id: false }
);

const pageTrafficTrackingSchema = new Schema(
    {
        pageUrl: String,
        visiterInfo: [visiterInfo],
        count: Number,
    },
    { strict: false }
);

const pageTrafficTracking = mongoose.model(
    'pageTrafficTracking',
    pageTrafficTrackingSchema
);
module.exports = pageTrafficTracking;
