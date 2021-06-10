const mongoose = require('mongoose');

const { Schema } = mongoose;
const trafficTrackingSchema = new Schema({}, { strict: false });

const trafficTracking = mongoose.model(
    'trafficTracking',
    trafficTrackingSchema
);
module.exports = trafficTracking;
