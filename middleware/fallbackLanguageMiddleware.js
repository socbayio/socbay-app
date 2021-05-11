var logger = require("../logger").Logger;

module.exports = (req, res, next) => {
    logger.info(`language ${req.language}`);
    logger.info(`languages ${req.languages}`);
    next();
};
