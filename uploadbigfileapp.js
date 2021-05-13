var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const busboy = require('connect-busboy');
const fs = require('fs-extra');
const { exec } = require('child_process');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(busboy({
  highWaterMark: 2 * 1024 * 1024,
}));

const uploadPath = path.join(__dirname, 'uploadfolder/');
fs.ensureDir(uploadPath);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.route('/upload').post((req,res,next)=>{
  req.pipe(req.busboy);
  
    req.busboy.on('file', (fieldname, file, filename) => {
        console.log(`Upload of '${filename}' started`);

        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(uploadPath, filename));
        // Pipe it trough
        file.pipe(fstream);

        // On finish of the upload
        fstream.on('close', () => {
            console.log(`Upload of '${filename}' finished`);
	    exec("ipfs add " + path.join(uploadPath, filename), (error, stdout, stderr)=>{
		console.log(`stdout: ${stdout}`);
		splitStdout = stdout.split(" ");
		console.log(splitStdout);
		res.render('index',{title: 'Demo File Upload', stdout: stdout, CID: splitStdout[1] ,peers: "", peersNumber:"", connectStatus:""});
	    });
           
        });
    });

});

app.route('/').get((req,res)=>{
  exec("ipfs swarm peers", (error, stdout, sterr)=>{
    var peersNumber = stdout.split("\n").length;
    if (peersNumber>10){
          var connectStatus = true;
    } else {
      var connectStatus = false;
    }
    res.render('index',{title: 'Demo File Upload', stdout: "", CID: "",  peers: "", peersNumber: peersNumber, connectStatus: connectStatus});
  });

});

app.route('/ipfsstatus').get((req,res)=>{
  exec("ipfs swarm peers", (error, stdout, stderr)=>{
    console.log(stdout.split("\n"));
    res.render('index',{title: 'Demo File Upload', stdout:"", CID: "", peers: stdout, peersNumber: "", connectStatus: ""});
  });
});

app.get('/ip',(req,res)=>{console.log(req.ip)});

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