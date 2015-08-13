var express = require('express');
var partials = require('express-partials');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use	(cookieParser('tH5pvrw@6lyw-NCFWtCq'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());
app.use(methodOverride('_method'));
app.use(session());

// Helpers dinámicos
app.use(function(req, res, next) {
  // Guardar el path en session.redir para redireccionar después del login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;

  next();
});

//Auto-logout de sesión a los 2 minutos de inactividad
app.use(function(req, res, next) {
  if (req.session.user) {
    var now = Date.now();
    var last = (req.session.user.last) ? req.session.user.last : Date.now();
    var diff = now - last;

    if (diff < (2 * 60 * 1000)) {
      req.session.user.last = now;
      next();
    }
    else {
      delete req.session.user;
      res.redirect(req.session.redir);
    }
  }
  else {
    next();
  }
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});


module.exports = app;
