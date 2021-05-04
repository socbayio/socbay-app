var express = require('express');
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
var router = express.Router();
const User = require('../models/userModel.js');

router.get('/', getInfoIfAuthenticated, function(req, res, next) {
  res.render('video', {userInfo: req.userInfo});
});

module.exports = router;
