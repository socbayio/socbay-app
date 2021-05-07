const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const globalSchema = new Schema({}, { strict: false });

const global = mongoose.model('global', globalSchema);
module.exports = global;
