const trafficTracking = require('../models/trafficTrackingModel')


module.exports = (req, res, next) => {
    trafficTracking.create({headers:req.headers,url:req.url, params:req.params, query:req.query, ip: req.ip},(error,log)=>{console.log(error,log)});
    next();
}