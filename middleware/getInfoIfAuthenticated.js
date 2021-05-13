const User = require('../models/userModel.js');

module.exports = (req, res, next) => {
    req.userInfo = {};
    if (loggedIn) {
        User.findById(req.session.userId, (error, user) => {
            req.userInfo = {
                username: user.username,
                emailaddress: user.emailaddress,
                profilePicture: user.profilePicture,
                subscriptionsId: user.subscriptions,
                uploadedVideos: user.uploadedVideos,
                userId: user._id,
            };
        });
    }

    next();
};
