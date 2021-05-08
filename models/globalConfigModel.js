const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const globalSchema = new Schema({}, { strict: false });

const globalConfig = mongoose.model('globalConfig',globalSchema);
module.exports = globalConfig;