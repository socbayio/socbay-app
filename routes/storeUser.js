var express = require('express');
var router = express.Router();

const User = require('../models/userModel.js');
const redirectIfAuthenticatedMiddleware = require('../middleware/redirectIfAuthenticatedMiddleware');

router.post('/', redirectIfAuthenticatedMiddleware, function (req, res, next) {
    User.create(req.body, (error, user) => {
        if (error) {
            const validationErrors = Object.keys(error.errors).map(
                (key) => error.errors[key].message
            );
            req.flash('validationErrors', validationErrors);
            req.flash('data', req.body);

            return res.redirect('/register');
        }

        req.session.userId = user._id;
        req.session.webLang = user.lang;

        return res.redirect('/');
    }); // could do either User.create(req.body,(error, user)=>{res.redirect()})
});

module.exports = router;
