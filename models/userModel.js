const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');

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

const userElementSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { _id : false }
);

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
        default: '/images/profilepicture/default.png'
    },
    uploadedVideos: [videoElementSchema],
    subscriptions: [userElementSchema]
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
