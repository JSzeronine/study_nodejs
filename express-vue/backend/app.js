var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { sequelize } = require( './models' );
const session = require( 'express-session' );
const passport = require( 'passport' );

const index = require( './routes/index' );
const movies = require( './routes/movies' );
const join = require( './routes/join' );
const login = require( './routes/login' );

const passportConfig = require( './passport' );

const app = express();
sequelize.sync();
passportConfig( passport );

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use( '/', index );
app.use( '/api/movies', movies );
app.use( '/api/join', join );
app.use( '/api/login', login );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use( passport.initialize() );
app.use( passport.session() );

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
