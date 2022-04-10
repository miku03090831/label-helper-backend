var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require("jsonwebtoken")

// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require("./routes/upload")
var getTaskRouter = require("./routes/getTask")
var taskChangeRouter = require("./routes/taskChange")
// var foodRouter = require('./routes/food');
// var medicineRouter = require('./routes/medicine');
// var personalrecordRouter = require('./routes/personalrecord');
// var userdataRouter = require('./routes/userdata');
// var periodRouter = require('./routes/period');

var app = express();
var http = require('http');
var server = http.createServer(app);

var bodyParser = require('body-parser'); 
const req = require('express/lib/request');


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
  if(req.url!=="/api/users/login" && req.url !=="/api/users/register"){
      // 获取token值
      // console.log("headers",req.headers)
      const token = req.headers.authorization;
      if(token){
          console.log("有token",token)
          jwt.verify(token,'mqh123',(err,result)=>{
              if(err){
                // console.log(err)
                  res.status(401).send({
                      status:false,
                      Msg:"没有获取到token值,请登录"
                  })
              }else{
                  next();
              }
          })
      }else{
          res.status(401).send({
              status:false,
              Msg:"没有获取到token值,请登录"
          })
      }
  }else{
      next();
  }
})

// app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use("/api/upload",uploadRouter);
app.use("/api/getTask",getTaskRouter);
app.use("/api/taskChange",taskChangeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('in 404 err handler');
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

server.listen('4000');
