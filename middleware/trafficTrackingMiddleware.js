const trafficTracking = require('../models/trafficTrackingModel')
const ipInfo = require("ipinfo")

module.exports = (req, res, next) => {
    ipInfo(req.ip, (error, cLoc)=>{
        trafficTracking.create({headers:req.headers,url:req.url, params:req.params, query:req.query, ip: req.ip, cLoc: cLoc},(error,log)=>{console.log(error,log)});
    })
    next();
}