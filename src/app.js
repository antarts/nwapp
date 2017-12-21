require('./models/init');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
// var useragent = require('express-useragent');
var connectMongodb = require('connect-mongo');
var session = require('express-session');
var config = require('./config');
var auth = require('./middlewares/auth');
// const R = require('ramda');
// var request = require('request');
// var axios = require('axios');

// const util = require('util');
// const fs = require('fs');
// var outputPathString = './write_jsonfile.txt';
// var dirPathString = './';

// const readdir = util.promisify(fs.readdir);

var api = require('./routes/route.api');
var page = require('./routes/route.page');
var MongoStore = new connectMongodb(session);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.cookieName)); //修改
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: config.sessionSecret,
    store: new MongoStore({
      url: config.mongodbUrl
    }),
    resave: true,
    saveUninitialized: true
  })
);

app.use(auth.authUser);

// app.use(useragent.express());
// app.use(function (req, res, next) {
//   console.log(req.useragent);
//   next();
// });
// var addTen = R.add(10);
// console.log(addTen(5));
// console.log(R.add(2,3), R.add(7)(10));

// function readTopics() {
//   request(
//     'https://cnodejs.org/api/v1/topics?page=1&tag=good&limit=1&mdrender=false',
//     function (err, response, body) {
//       if (err) {
//         return;
//       }

//       var list = JSON.parse(body).data;
//       readUserInfo(list[0].author.loginname);
//     }
//   );
// }

// function readUserInfo(name) {
//   request('https://cnodejs.org/api/v1/user/' + name, function (err, response, body) {
//     var info = JSON.parse(body).data;
//     console.log(info);
//   });
// }

// readTopics();

// var readData = function(response) {
//   return response.data;
// };

// function readTopics() {
//   return axios
//     .get(
//       'https://cnodejs.org/api/v1/topics?page=1&tag=good&limit=1&mdrender=false'
//     )
//     .then(readData)
//     .then(result => result.data[0].author.loginname);
// }

// function readUserInfo(name) {
//   return axios.get('https://cnodejs.org/api/v1/user/' + name)
//   .then(readData)
//   .then(result => result.data)
// }

// readTopics()
//   .then(readUserInfo)
//   .then(console.log)
//   .catch(console.log);

// function writeFile(path) {
//   return function (content) {
//     return util.promisify(fs.writeFile)(path, content);
//   }
// }

// readdir(dirPathString)
//   .then(R.filter(R.test(/.json/)))
//   .then(R.filter(R.compose(R.not, R.isNil)))
//   .then(writeFile(outputPathString))
//   .catch(console.log);

app.use('/', page);
app.use('/api/v1', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.format({
    json() {
      res.send({error: err.toString()});
    },

    html() {
      res.render('error');
    },
    default() {
      const message = `${errorDetails}`;
      res.send(`500 Internal server error:\n${err.toString()}`);
    },
  });
});

module.exports = app;
