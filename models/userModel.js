const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
const subReferencesPopulate = require('mongoose-sub-references-populate');

const Schema = mongoose.Schema;

const videoElementSchema = new Schema(
    {
        videoId: {
            type: Schema.Types.ObjectId,
            ref: 'Video',
            required: true,
        },
        lang: String,
        timestamp: {
            type: Number,
            default: Date.now,
        },
    },
    { _id: false }
);

const fileElementSchema = new Schema(
    {
        fileId: {
            type: Schema.Types.ObjectId,
            subRef: 'uploadBlock.filesInfo',
            required: true,
        },
    },
    { _id: false }
);

const userElementSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { _id: false }
);

const UserSchema = new Schema({
    username: {
        type: String,
        required: false,
    },
    emailaddress: {
        type: String,
        unique: true,
        required: [true, 'Please provide email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
    },
    profilePicture: {
        type: String,
        default: '/images/profilepicture/default.png',
    },
    lang: {
        type: String,
        default: 'en',
    },
    uploadedVideos: [videoElementSchema],
    uploadedFiles: [fileElementSchema],
    subscriptions: [userElementSchema],
});

UserSchema.plugin(uniqueValidator);
fileElementSchema.plugin(subReferencesPopulate);

UserSchema.pre('save', function (next) {
    if(!this.isModified('password')){
        return next();
    }
    
    const user = this;
    bcrypt.hash(user.password, 10, (error, hash) => {
        user.password = hash;
        next();
    });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
