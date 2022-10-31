const createError = require('http-errors');
const express = require('express');
const path = require('path');

const passport = require('passport');
const session = require('express-session');

const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const formatDistanceToNow = require('date-fns/formatDistanceToNow');

const dotenv = require('dotenv');

// Load secure credentials
dotenv.config();

// Setup database
require('./config/database');

var app = express();

// For use in view templates
// app.locals.formatDistanceToNow = formatDistanceToNow;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// authentication setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

// Pass user to all views
app.use(function (req, res, next) {
  res.locals.user = req.user;
  res.locals.errorMessages = req.session.messages;
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// Authentication routes
app.post(
  '/log-in',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
    failureMessage: true,
  })
);

app.get('/log-out', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

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
