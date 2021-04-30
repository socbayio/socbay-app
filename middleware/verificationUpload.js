module.exports = (req, res, next) => {
    if (!req.body.title || !req.body.CID){
        res.redirect('/uploadvideo');
    }
    next()
}
