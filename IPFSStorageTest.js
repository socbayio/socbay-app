var express = require('express');
var router = express.Router();
const getInfoIfAuthenticated = require('../middleware/getInfoIfAuthenticated.js');

const { getVideosFromTagPromiseStyle } = require('./common.js');

router.get('/', getInfoIfAuthenticated, async function(req, res,next) {
    try {
        
    } catch (e) {
        console.error(`Index page fail with error: ${e}`);
        next(e);
    }
});

module.exports = router;

const { exec } = require('child_process');

exec('ipfs swarm peers', (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  console.log(`stdout:\n${stdout}`);
});