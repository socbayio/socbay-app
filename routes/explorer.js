const express = require('express');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        res.render('explorer');
    } catch (e) {
        next(e);
    }
});

module.exports = router;
