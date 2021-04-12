const mongoose = require('mongoose');
const newVideo = require('./models/newVideosModel');
const video = require('./models/videoModel');
const user = require('./models/userModel')

mongoose.connect("mongodb://localhost:27028/crustlive", {
    "auth": { "authSource": "admin" },
    "user": "ntn",
    "pass": "wv%nzw=VY$fMwV4",
    "useNewUrlParser": true
});

// a function in our model called create
user.findOne({emailaddress: 'anonymous@ntn.com'}, (error, userfound)=>{
    if (!userfound) {
        user.create({
            username: 'Anonymous Contributor',
            emailaddress: 'anonymous@ntn.com',
            password: 'zxcvbnm1@'
        })
    }
})
var anonymousID = "";
var anonymousUsername = "";
user.findOne({emailaddress: 'anonymous@ntn.com'}, (error, anonymous)=>{
    anonymousID = anonymous._id;
    anonymousUsername = anonymous.username;
    //console.log(anonymousUsername,anonymousID)

    video.create({
        title: 'Trường Học Uy Long 1 (1991) – Phim Hài Châu Tinh Trì [Lồng Tiếng, HD]',
        CID: 'QmNbmaa5gjw1WFSJ4rKNvJ9eCW8rWGgD7kkvsn6LqgAFn9',
        thumbnail: '/images/courses/img-1.jpg',
        author: {username: anonymousUsername, authorId: anonymousID}
    },(error, videoCreated)=>{
        newVideo.create({videoId: videoCreated._id});
    });

    video.create({
        title: 'Amazing! Animal',
        CID: 'QmdUkfAMwiyPnRGNoaGjuK1JEP4W8C4raoskkdTikUAsc4',
        thumbnail: '/images/courses/img-1.jpg',
        author: {username: anonymousUsername, authorId: anonymousID}
    },(error, videoCreated)=>{
        newVideo.create({videoId: videoCreated._id});
    });


})






