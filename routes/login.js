const express = require('express');

const router = express.Router();
const redirectIfAuthenticatedMiddleware = require('../middleware/redirectIfAuthenticatedMiddleware');

router.get('/', redirectIfAuthenticatedMiddleware, (req, res, next) => {
    res.render('login');
});

module.exports = router;
