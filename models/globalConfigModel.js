const mongoose = require('mongoose');

const { Schema } = mongoose;

const globalSchema = new Schema({}, { strict: false });

const globalConfig = mongoose.model('globalConfig', globalSchema);
module.exports = globalConfig;
