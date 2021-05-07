var fs = require("fs");

var Logger = (exports.Logger = {});

// createWriteStream takes in options as a second, optional parameter
// if you wanted to set the file encoding of your output file you could
// do so by setting it like so: ('logs/debug.txt' , { encoding : 'utf-8' });
var infoStream = fs.createWriteStream("logs/info.txt", {'flags': 'a'});
var errorStream = fs.createWriteStream("logs/error.txt", {'flags': 'a'});
var crustSocbayPinnerStream = fs.createWriteStream("logs/crustSocbayPinnerLog.txt", {'flags': 'a'});
var debugStream = fs.createWriteStream("logs/debug.txt", {'flags': 'a'});

Logger.info = function(msg) {
  var message = new Date().toISOString() + " : " + msg + "\n";
  infoStream.write(message);
};

Logger.debug = function(msg) {
  var message = new Date().toISOString() + " : " + msg + "\n";
  debugStream.write(message);
};

Logger.error = function(msg) {
  var message = new Date().toISOString() + " : " + msg + "\n";
  errorStream.write(message);
};

Logger.crustSocbayPinner = function(msg) {
    var message = new Date().toISOString() + " : " + msg + "\n";
    crustSocbayPinnerStream.write(message);
};