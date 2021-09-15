const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const flash = require('connect-flash');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const Backend = require('i18next-node-fs-backend');
const fileUpload = require('express-fileupload');

const config = require('./config');

/**
  MongooseDB
 */

mongoose.connect(`${config.dbServerUrl}socbay`, config.userAuth);

/**
  i18next
 */

i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        backend: {
            loadPath: `${__dirname}/locales/{{lng}}/{{ns}}.json`,
        },
        detection: {
            order: ['querystring', 'cookie', 'header'],
            caches: ['cookie'],
        },
        fallbackLng: 'en',
        preload: ['en'],
    });

/**
  Models
 */
const globalConfig = require('./models/globalConfigModel');

/**
  Routes
 */
const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const userLoginRouter = require('./routes/userLogin');
const uploadVideoRouter = require('./routes/uploadVideo');
const storeVideoRouter = require('./routes/storeVideo');
const videoRouter = require('./routes/video');
const storeUser = require('./routes/storeUser');
const userLogout = require('./routes/logout');
const aboutUsRouter = require('./routes/aboutUs');
const pullvideoRouter = require('./routes/pullvideo');
const tagVideoRouter = require('./routes/tagVideo');
const boomVideoRouter = require('./routes/boomVideo');
const searchRouter = require('./routes/searchVideos');
const myInfoRouter = require('./routes/myinfo');
const channelRouter = require('./routes/channel');
const uploadHistoryRouter = require('./routes/uploadHistory');
const deleteVideoRouter = require('./routes/deleteVideo');
const storeProfilePictureRouter = require('./routes/storeProfilePicture');
const explorerRouter = require('./routes/explorer');

/**
  Middleware
 */
const pageTrafficTracking = require('./middleware/pageTrafficTrackingMiddleware');
const getCurrentLanguageMiddleware = require('./middleware/getCurrentLanguageMiddleware');

const app = express();

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
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/user/login', userLoginRouter);
app.use('/logout', userLogout);
app.use('/video', videoRouter);
app.use('/uploadvideo', uploadVideoRouter);
app.use('/uploadvideo/store', storeVideoRouter);
app.use('/video/:videoId', getCurrentLanguageMiddleware, pullvideoRouter);
app.use('/video/:videoId/delete', deleteVideoRouter);
app.use('/register/store', storeUser);
app.use('/aboutus', aboutUsRouter);
app.use('/tag/:tagId', getCurrentLanguageMiddleware, tagVideoRouter);
app.use('/boom/:videoId', boomVideoRouter);
app.use('/search', searchRouter);
app.use('/myinfo', myInfoRouter);
app.use('/channel/:channelId', channelRouter);
app.use('/uploadhistory', uploadHistoryRouter);
app.use('/myinfo/uploadavatar', storeProfilePictureRouter);
app.use('/explorer', explorerRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
