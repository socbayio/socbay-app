const ipInfo = require('ipinfo');
const trafficTracking = require('../models/trafficTrackingModel');

module.exports = (req, res, next) => {
    ipInfo(req.ip, (error, cLoc) => {
        trafficTracking.create(
            {
                headers: req.headers,
                url: req.url,
                params: req.params,
                query: req.query,
                ip: req.ip,
                cLoc,
            },
            (_error, _log) => {}
        );
    });
    next();
};
