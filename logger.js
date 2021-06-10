const fs = require('fs');
const path = require('path');

const Logger = (exports.Logger = {});

const infoStream = fs.createWriteStream(
    path.join(__dirname, 'logs', 'info.txt'),
    { flags: 'a' }
);
const errorStream = fs.createWriteStream(
    path.join(__dirname, 'logs', 'error.txt'),
    { flags: 'a' }
);
const crustSocbayPinnerStream = fs.createWriteStream(
    path.join(__dirname, 'logs', 'crustSocbayPinnerLog.txt'),
    { flags: 'a' }
);
const debugStream = fs.createWriteStream(
    path.join(__dirname, 'logs', 'debug.txt'),
    { flags: 'a' }
);

Logger.info = function (msg) {
    const message = `${new Date().toUTCString()} : ${msg}\n`;
    infoStream.write(message);
};

Logger.debug = function (msg) {
    const message = `${new Date().toUTCString()} : ${msg}\n`;
    debugStream.write(message);
};

Logger.error = function (msg) {
    const message = `${new Date().toUTCString()} : ${msg}\n`;
    errorStream.write(message);
};

Logger.crustSocbayPinner = function (msg) {
    const message = `${new Date().toUTCString()} : ${msg}\n`;
    crustSocbayPinnerStream.write(message);
};
