var path = require('path');
var express = require('express');
var router = express.Router();

const { exec, spawn } = require('child_process');
/* 
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
 */
function execShellCommand(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

function addFile(path) {
    return new Promise((resolve, reject) => {
        exec('ipfs add ' + path, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

router.get('/', async (req, res, next) => {
    try {
        res.redirect('/uploadfile');
        if (true) {
            //req.files && req.files.image
            //let image = req.files.image;
            //let pathImage = path.resolve(__dirname,'..','public/images/testfolder',image.name);
            //await image.mv(pathImage) //, (error)=>{}

            let filename = 'tagVideo.js';
            // const abc = exec("ipfs add " + path.join(__dirname, filename));
            // abc.then(abc => console.log(abc))
            // .catch(xxx => console.log(xxx))
            //const abc = await execShellCommand("ipfs add --" + path.join(__dirname, filename));
            //const xxx = await addFile(path.join(__dirname, filename));
            // console.log(await execShellCommand('ipfs pin rm QmcJLAEEVBCZGCF5WnGtRphBG9uvh4wdMKCKsfpGq6FBqW'))
            // console.log(await execShellCommand('ipfs pin rm QmdazcgGKpLTYZE6j9wZPEsfPxgByKDoEDBQisLUKtnFpd'))
            // console.log(await execShellCommand('ipfs repo gc'))

            //console.log(xxx)
            console.log('-------------------');
            let counter = 0;
            //const ls = spawn('dir');
            const ls = spawn('ipfs', ['addxxx', '-r', './public'], {
                shell: true,
            });
            ls.stdout.on('data', (data) => {
                counter++;
                console.log(`sdtout ${counter}`);
                console.log(`stdout: ${data}`);
            });

            ls.stderr.on('data', (data) => {
                counter++;
                console.log(`stderr ${counter}`);
                console.error(`stderr: ${data}`);
            });

            ls.on('close', (code) => {
                counter++;
                console.log(`close ${counter}`);
                console.log(`child process exited with code ${code}`);
            });
        }
    } catch (e) {
        console.error(`Index page fail with error: ${e}`);
        //next(e);
    }
});

module.exports = router;
