const express = require('express');

const router = express.Router();
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated');

router.get('/', getInfoIfAuthenticated, (req, res, next) => {
    res.render('universalUpload', { userInfo: req.userInfo });
});

module.exports = router;
