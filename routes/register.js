var express = require('express');
var router = express.Router();
const redirectIfAuthenticatedMiddleware = require('../middleware/redirectIfAuthenticatedMiddleware');

router.get('/', redirectIfAuthenticatedMiddleware, function (req, res, next) {
    var emailaddress = '';
    var password = '';
    var username = '';
    const data = req.flash('data')[0];

    if (typeof data != 'undefined') {
        username = data.username;
        emailaddress = data.emailaddress;
        password = data.password;
    }
    res.render('register', {
        errors: req.flash('validationErrors'),
        username: username,
        emailaddress: emailaddress,
        password: password,
    });
});

module.exports = router;
