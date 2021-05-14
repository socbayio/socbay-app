var express = require('express');
var router = express.Router();
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');
const { getAllUsers } = require('./common');

router.get('/', getInfoIfAuthenticated, async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.render('allUsers', { users });
    } catch (error) {}
});

module.exports = router;
