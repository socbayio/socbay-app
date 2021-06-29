const express = require('express');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        res.render('explorer', { cid: req.query.cid });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
