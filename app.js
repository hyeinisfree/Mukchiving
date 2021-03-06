const createError = require('http-errors');
const express = require('express');
const dotenv = require('dotenv');
const logger = require('morgan');
const cors = require("cors");
const path = require('path');
const passport = require('passport');

dotenv.config();
const { sequelize } = require("./models");
const passportConfig = require('./config/passport-config');
const routes = require('./routes');
const { RequestHeaderFieldsTooLarge } = require('http-errors');

const app = express();

sequelize
  .sync()
  .then(() => {
    console.log("DB 연결 성공");
  })
  .catch(console.error);
  
app.use(passport.initialize());
passportConfig();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const prod = process.env.NODE_ENV === "production";

if (prod) {
  app.enable("trust proxy");
  app.use(logger("combined"));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(hpp());
} else {
  app.use(logger("dev"));
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

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
