const express = require('express');

const router = express.Router();

const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const redirectIfAuthenticatedMiddleware = require('../middleware/redirectIfAuthenticatedMiddleware');

router.post('/', redirectIfAuthenticatedMiddleware, (req, res, next) => {
    const { emailaddress, password } = req.body;
    User.findOne({ emailaddress }, (error, user) => {
        if (user) {
            bcrypt.compare(password, user.password, (errorBcrypt, same) => {
                if (same) {
                    req.session.userId = user._id;
                    req.session.webLang = user.lang;
                    res.redirect('/');
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
