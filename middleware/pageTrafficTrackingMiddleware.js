const ipInfo = require('ipinfo');
const pageTrafficTracking = require('../models/pageTrafficTrackingModel');

module.exports = (req, res, next) => {
    const pageUrl = req.url;
    const { headers } = req;
    const { ip } = req;
    ipInfo(ip, (error, location) => {
        pageTrafficTracking.findOneAndUpdate(
            { pageUrl },
            {
                $inc: { count: 1 },
                $push: { visiterInfo: { ip, location, headers } },
            },
            (_error, trackingPage) => {
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
