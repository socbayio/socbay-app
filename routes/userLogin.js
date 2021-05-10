var express = require('express');
var router = express.Router();

const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const redirectIfAuthenticatedMiddleware = require('../middleware/redirectIfAuthenticatedMiddleware');

router.post('/', redirectIfAuthenticatedMiddleware, function (req, res, next) {
    const { emailaddress, password } = req.body;
    User.findOne({ emailaddress: emailaddress }, (error, user) => {
        if (user) {
            bcrypt.compare(password, user.password, (error, same) => {
                if (same) {
                    // if passwords match

                    req.session.userId = user._id; // store user session, will talk about it later
                    req.session.webLang = user.lang; // store language to session

                    res.redirect('/?lng=' + user.lang);
                } else {
                    res.redirect('/login');
                }
            });
        } else {
            res.redirect('/login');
        }
    });
});

module.exports = router;
