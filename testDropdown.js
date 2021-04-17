var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const flash = require('connect-flash');

const { getVideoDurationInSeconds } = require('get-video-duration')
const User = require('./models/userModel.js');
const Video = require('./models/videoModel.js');
const newVideo = require('./models/newVideosModel.js');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(expressSession({
  secret: 'keyboard cat',
  resave: true,
    saveUninitialized: true
}))

global.loggedIn = null;
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next()
});


mongoose.connect("mongodb://localhost:27028/crustlive", {
    "auth": { "authSource": "admin" },
    "user": "ntn",
    "pass": "wv%nzw=VY$fMwV4",
    "useNewUrlParser": true
});

//videoTag.create({tagName:'newVideos',videos:[]},(error,tag)=>{console.log(error,tag)});
//videoTag.updateOne({tagName:'newVideos'},{ $push: { videos: 'abcde' } },(error,tag)=>{console.log(error,tag)});
//videoTag.findOne({tagName:'newVideos'},(error,tag)=>{console.log(error,tag)})

const videoTag = require('./models/videoTagModel.js');


app.get('/test',(req,res)=>{
    res.render('uploadVideo')
})
app.post('/uploadvideo/store',async (req,res)=>{
    console.log(req.body)
    if (req.body.thumbnail == "") {req.body.thumbnail= "/images/courses/img-1.jpg"}
    req.body.author ={username:'user.username', authorId: 'user._id'};
            
    await getVideoDurationInSeconds('https://ipfs.io/ipfs/'+req.body.CID)
    .then((duration) => {
        req.body.durationInSecond = duration;})
    .catch((error)=>{})
    
    //console.log(req.body);
    Video.create(req.body,(error,video)=>{
        if (error) {
            return;
        }
        newVideo.create({videoId:video._id});
        videoTag.updateOne({tagName:'newVideos'},{ $push: { videos: video._id} },(error,tag)=>{});
        videoTag.findOne({tagName:req.body.tag},(error,tag)=>{
            if (!tag){
                videoTag.create({tagName: req.body.tag, videos:[video._id]},(errortag,newtag)=>{})
            }
            else {
                videoTag.updateOne({tagName:req.body.tag},{ $push: { videos: video._id} },(error,tag)=>{});
            }
        })
        return;
    });  
})

const fileUpload = require('express-fileupload')
app.use(fileUpload())

var uploadFileRouter = require('./routes/uploadFile');
var uploadFileStoreRouter = require('./routes/uploadFileStore');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => {
    console.log('Example app listening at http://localhost:3000')
  })

module.exports = app;
