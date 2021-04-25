const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String,
        required: false
    },
    emailaddress: {
        type: String,
        unique: true,
        required: [true, 'Please provide email']
    },
    password: {
        type: String,
        required: [true, 'Please provide password']
    },
    profilePicture: {
        type: String,
        default: 'https://i.stack.imgur.com/l60Hf.png'
    },
    uploadedVideos: [],
    subscriptions: []
});

UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', function(next){
    const user = this      
    bcrypt.hash(user.password, 10,  (error, hash) => {        
      user.password = hash 
      next() 
    }); 
});

const User = mongoose.model('User',UserSchema);
module.exports = User;
