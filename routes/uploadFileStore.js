var path = require('path');
var express = require('express');
var router = express.Router();


router.post('/', (req,res)=>{
    let image = req.files.image;
    console.log(image)
    image.mv(path.resolve(__dirname,'../public/uploadedimg',image.name), (error)=>{
        console.log(path.resolve(__dirname,'../public/uploadedimg',image.name))
        console.log(error);
        res.redirect('/')
    })

    })


module.exports = router;