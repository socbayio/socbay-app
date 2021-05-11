module.exports = (req, res, next) => {
    let languagesBase = ['en','vi']
    let userLangs = req.languages;
    req.currentLang = userLangs[userLangs.length-1];
    if (userLangs.length > 1){
        if (languagesBase.includes(userLangs[userLangs.length-2])) {
            req.currentLang = userLangs[userLangs.length-2];
        }
    }
    next();
};
