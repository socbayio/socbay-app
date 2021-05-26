var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config');

/**
  MongooseDB
 */
const mongoose = require('mongoose');
const expressSession = require('express-session');
const flash = require('connect-flash');
console.log(config);

mongoose.connect(config.dbServerUrl + 'socbay', config.userAuth);

/**
  i18next
 */
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const Backend = require('i18next-node-fs-backend');
i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        backend: {
            loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
        },
        detection: {
            order: ['querystring', 'cookie', 'header'],
            caches: ['cookie'],
        },
        fallbackLng: 'en',
        preload: ['en', 'vi'],
    });

/**
  Models
 */
const { uploadBlock } = require('./models/uploadBlockModel');
const globalConfig = require('./models/globalConfigModel');  

/**
  Routes
 */
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
var aboutUsRouter = require('./routes/aboutUs');
var pullvideoRouter = require('./routes/pullvideo');
var tagVideoRouter = require('./routes/tagVideo');
var boomVideoRouter = require('./routes/boomVideo');
var searchRouter = require('./routes/searchVideos');
var myInfoRouter = require('./routes/myinfo.js');
var channelRouter = require('./routes/channel');
var uploadHistoryRouter = require('./routes/uploadHistory');
var universalUploadRouter = require('./routes/universalUpload');
var universalStoreRouter = require('./routes/universalStore');
var deleteVideoRouter = require('./routes/deleteVideo');
var storeProfilePictureRouter = require('./routes/storeProfilePicture');

/**
  Middleware
 */
var pageTrafficTracking = require('./middleware/pageTrafficTrackingMiddleware');
var getCurrentLanguageMiddleware = require('./middleware/getCurrentLanguageMiddleware');

const fileUpload = require('express-fileupload');

var app = express();

app.use(i18nextMiddleware.handle(i18next));

app.set('trust proxy', true);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
    fileUpload({
        createParentPath: true,
    })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(
    expressSession({
        secret: config.secretKeyExpressSession,
    })
);

globalConfig.findOne({ variableName: 'updateblock' }, (error, updateBlock) => {
    global.globalCurrentBlock = {
        blockNumber: updateBlock._doc.currentBlock,
        filesNumber: updateBlock._doc.filesNumber,
        totalSizeInByte: updateBlock._doc.totalSizeInByte,
    };
});

global.loggedIn = null;
app.use('*', (req, res, next) => {
    loggedIn = req.session.userId;
    next();
});

app.use(pageTrafficTracking);
app.use('/', getCurrentLanguageMiddleware, indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/user/login', userLoginRouter);
app.use('/logout', userLogout);
app.use('/video', videoRouter);
app.use('/uploadvideo', uploadVideoRouter);
app.use('/uploadvideo/store', storeVideoRouter);
app.use('/video/:videoId', pullvideoRouter);
app.use('/video/:videoId/delete', deleteVideoRouter);
app.use('/register/store', storeUser);
app.use('/aboutus', aboutUsRouter);
app.use('/tag/:tagId', getCurrentLanguageMiddleware, tagVideoRouter);
app.use('/boom/:videoId', boomVideoRouter);
app.use('/search', searchRouter);
app.use('/myinfo', myInfoRouter);
app.use('/channel/:channelId', channelRouter);
app.use('/uploadhistory', uploadHistoryRouter);
app.use('/upload', universalUploadRouter);
app.use('/upload/store', universalStoreRouter);
app.use('/myinfo/uploadavatar', storeProfilePictureRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
