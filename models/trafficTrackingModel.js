const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const trafficTrackingSchema = new Schema({}, { strict: false });

const trafficTracking = mongoose.model(
    'trafficTracking',
    trafficTrackingSchema
);
module.exports = trafficTracking;
