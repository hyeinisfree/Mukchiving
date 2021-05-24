var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

const passport = require('passport');
const passportConfig = require('./config/passport');

const routes = require('./routes');
const { connect } = require('./db');
const { RequestHeaderFieldsTooLarge } = require('http-errors');

// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;

// const bcrypt = require('bcrypt');
// var db = require('./db');
// var conn = db.init();

// db.connect(conn);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// passport.serializeUser((user, done) => {
//   done(null, user.user_id);
// });

// passport.deserializeUser(async (user_id, done) => {
//   var user;
//     try {
//       var sql = 'select * from user where user_id = ?';
//       var params = [user_id];
//       await conn.query(sql, params, async function (err, rows, fields) {
//         if(err) {
//           console.log(err);
//           return done(null, false);
//         }
//         if(!rows[0]) return done(null, false);
//         user = rows[0];

//         console.log(user);
//         return done(null, user);
//       }) 
//     } catch (e) {
//       return done(e);
//     }
// }); 

// passport.use(new LocalStrategy({
//   usernameField: 'user_id',
//   passwordField: 'password'
// }, async function(user_id, password, done) {
//     var user;
//     try {
//       var sql = 'select * from user where user_id = ?';
//       var params = [user_id];
//       await conn.query(sql, params, async function (err, rows, fields) {
//         if(err) {
//           console.log(err);
//           return done(null, false);
//         }
//         if(!rows[0]) return done(null, false);
//         user = rows[0];

//         console.log(password, user.password);
//         const checkPassword = await bcrypt.compare(password, user.password);
//         console.log(checkPassword);
//         if(!checkPassword) return done(null, false);

//         console.log(user);
//         return done(null, user);
//       }) 
//     } catch (e) {
//       return done(e);
//     }
//   }
// ))

// app.use(cookieParser('session-secret-key'));
// app.use(session({
//   secret: 'session-secret-key',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     httpOnly: true,
//     secure: false,
//   },
// }));

// app.use(passport.initialize());
// app.use(passport.session());

app.use(passport.initialize());
passportConfig();

app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.post('/', (req, res) => {
  var title = req.body.title;
  console.log(req.body);
  console.log(title);
  res.json({message : "Request Test Success", title : title});
})

app.post('/login',
  passport.authenticate('local'),
  (req, res) => {
    console.log(req.session);
    res.json(req.user);
});

app.post('/logout', (req, res, next) => {
  return req.logout();
});

app.get('/', (req, res, next) => {
  if(req.isAuthenticated()) return res.json(req.user);
  return res.json({message: 'user 없음'});
});

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
