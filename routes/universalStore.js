var express = require('express');
var router = express.Router();
var path = require('path');
const global = require('../models/globalModel')

const { addFileInfo, addFileToIPFSPromise } = require('./common');

router.post('/', async function(req, res, next) {
    try {
        let file = req.files.file_data;
        const updateBlock = await global.findOne({variableName:'updateblock'});
        let pathFile = path.resolve(__dirname,'..','public/block',updateBlock._doc.currentBlock.toString(),file.name);
        await file.mv(pathFile);
        const output = await addFileToIPFSPromise(pathFile);
        console.log(updateBlock._doc.currentBlock,file.name,file.size,output)
        addFileInfo(updateBlock._doc.currentBlock,file.name,file.size,output);
        res.send({CID:output})
        res.end();
    } catch (e) {
        //Rework error catching
        console.error(`UniversalStore page fail with error: ${e}`);
        next(e);
    }
});

module.exports = router;

