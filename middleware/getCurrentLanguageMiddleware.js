const config = require('../config');

module.exports = (req, res, next) => {
    const languagesBase = config.supportedLangs;
    const userLangs = req.languages;
    req.currentLang = userLangs[userLangs.length - 1];
    if (userLangs.length > 1) {
        if (languagesBase.includes(userLangs[userLangs.length - 2])) {
            req.currentLang = userLangs[userLangs.length - 2];
        }
    }
    next();
};
