var express = require('express');
var router = express.Router();
const redirectIfAuthenticatedMiddleware = require('../middleware/redirectIfAuthenticatedMiddleware');

router.get('/', redirectIfAuthenticatedMiddleware, function(req, res, next) {
  res.render('login');
});


module.exports = router;
