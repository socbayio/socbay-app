const pageTrafficTracking = require('../models/pageTrafficTrackingModel');
const ipInfo = require('ipinfo');

module.exports = (req, res, next) => {
    let pageUrl = req.url;
    let headers = req.headers;
    let ip = req.ip;
    ipInfo(ip, (error, location) => {
        pageTrafficTracking.findOneAndUpdate(
            { pageUrl },
            {
                $inc: { count: 1 },
                $push: { visiterInfo: { ip, location, headers } },
            },
            (error, trackingPage) => {
                if (!trackingPage) {
                    pageTrafficTracking.create({
                        pageUrl,
                        visiterInfo: [{ ip, location, headers }],
                        count: 1,
                    });
                }
            }
        );
    });
    next();
};
