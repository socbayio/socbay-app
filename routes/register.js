const express = require('express');

const router = express.Router();
const redirectIfAuthenticatedMiddleware = require('../middleware/redirectIfAuthenticatedMiddleware');

router.get('/', redirectIfAuthenticatedMiddleware, (req, res, next) => {
    let emailaddress = '';
    let password = '';
    let username = '';
    let lang = '';
    const data = req.flash('data')[0];

    if (typeof data !== 'undefined') {
        username = data.username;
        emailaddress = data.emailaddress;
        password = data.password;
        lang = data.lang;
    }

    res.render('register', {
        errors: req.flash('validationErrors'),
        username,
        emailaddress,
        password,
        lang,
    });
});

module.exports = router;
