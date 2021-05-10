var express = require('express');
var router = express.Router();
const redirectIfAuthenticatedMiddleware = require('../middleware/redirectIfAuthenticatedMiddleware');

router.get('/', redirectIfAuthenticatedMiddleware, function (req, res, next) {
    var emailaddress = '';
    var password = '';
    var username = '';
    var lang = '';
    const data = req.flash('data')[0];

    if (typeof data != 'undefined') {
        username = data.username;
        emailaddress = data.emailaddress;
        password = data.password;
        lang = data.lang;
    }

    res.render('register', {
        errors: req.flash('validationErrors'),
        username: username,
        emailaddress: emailaddress,
        password: password,
        lang: lang,
    });
});

module.exports = router;
