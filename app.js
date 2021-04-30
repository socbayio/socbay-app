var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const flash = require('connect-flash');
mongoose.connect("mongodb://localhost:27028/socbay", {
    "auth": { "authSource": "admin" },
    "user": "ntn",
    "pass": "wv%nzw=VY$fMwV4",
    "useNewUrlParser": true
});
  
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var userLoginRouter = require('./routes/userLogin');
var uploadVideoRouter = require('./routes/uploadVideo');
var storeVideoRouter = require('./routes/storeVideo');

var videoRouter = require('./routes/video');
var storeUser = require('./routes/storeUser');
var userLogout = require('./routes/logout');
var aboutUsRouter = require('./routes/aboutUs')
var pullvideoRouter = require('./routes/pullvideo');
var tagVideoRouter = require('./routes/tagVideo');
var boomVideoRouter = require('./routes/boomVideo')
var searchRouter = require('./routes/searchVideos');
var myInfoRouter = require('./routes/myinfo.js');
var channelRouter = require('./routes/channel');
var uploadHistoryRouter = require('./routes/uploadHistory')
var trafficTracking = require('./middleware/trafficTrackingMiddleware');

const fileUpload = require('express-fileupload')



var app = express();

app.set('trust proxy', true);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(fileUpload( {
  createParentPath: true
} ));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(expressSession({
  secret: 'keyboard cat'
}))

global.loggedIn = null;
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next()
});

app.use(trafficTracking);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/user/login', userLoginRouter);
app.use('/logout',userLogout);
app.use('/video', videoRouter);
app.use('/uploadvideo', uploadVideoRouter);
app.use('/uploadvideo/store', storeVideoRouter);
app.use('/video/:videoId',pullvideoRouter);
app.use('/register/store', storeUser);
app.use('/aboutus', aboutUsRouter);
app.use('/tag/:tagId',tagVideoRouter);
app.use('/boom/:videoId',boomVideoRouter);
app.use('/search', searchRouter);
app.use('/myinfo', myInfoRouter);
app.use('/channel/:channelId', channelRouter);
app.use('/uploadhistory', uploadHistoryRouter);
//app.get('/search', (req,res)=>{console.log(req.query.keyword)})


var uploadFileRouter = require('./routes/uploadFile');
var uploadFileStoreRouter = require('./routes/uploadFileStore');
app.use('/uploadfile',uploadFileRouter);
app.use('/uploadfile/store',uploadFileStoreRouter);

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

module.exports = app;
