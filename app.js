var createError = require("http-errors");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var jwt = require("jwt-simple"); //引入jwt中间件
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require('mongoose');
const fs = require("fs");
const multer = require("multer");
var app = express();

var upload = multer({ dest: 'uploads/' }) //当前目录下建立文件夹uploads

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var merchanctRouter = require("./routes/merchanct");
var multerUpload = require('./routes/upload');


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//本来是public 目录，现在将uploads目录作为静态资源目录。
//在浏览器中直接输入http://localhost:3000/1569570648265-www.ico.la_69ad25f6bbc263dd02a3d6c6a6795ecf_48X48.ico即可访问
app.use(express.static(path.join(__dirname, "uploads")));

//设置jwt密钥
// app.set("jwtTokenSecret", "qwert569263082@!");

//配置body-parser中间件
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//设置允许跨域访问该服务.
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //请求源
    res.header('Access-Control-Allow-Headers', '*'); //请求头
    res.header('Access-Control-Max-Age', 600); //请求时间，对option预请求过滤
    res.header('Access-Control-Allow-Methods', '*'); //请求方法  
    res.header('Content-Type', 'application/json;charset=utf-8');

    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});


// app.all("/article", (req, res) => {
//   // 获取token,这里默认是放在headers的authorization
//   let token = req.headers.authorization;
//   if (token) {
//     let decoded = jwt.decode(token, app.get("jwtTokenSecret"));
//     // 判断是否token已过期以及接收方是否为自己
//     if (decoded.exp <= Date.now() || decoded.aud !== "hit") {
//       res.sendStatus(401);
//     } else {
//       res.sendStatus(200);
//     }
//   } else {
//     res.sendStatus(401);
//   }
// });

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/merchant", merchanctRouter);
app.use('/upload', multerUpload);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/takeawayShopApi');

mongoose.connection.on("connected", function() {
    console.log("MongoDB connected success.")
});

mongoose.connection.on("error", function() {
    console.log("MongoDB connected fail.")
});

mongoose.connection.on("disconnected", function() {
    console.log("MongoDB connected disconnected.")
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;