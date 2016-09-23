var path = require('path');
var express = require('express');
var multer  = require('multer');
var exphbs  = require('express-handlebars');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var glob = require('glob');
var mqttClient  = require('./core/mqttutil');

module.exports = function(app, config) {
   var env = process.env.NODE_ENV || 'development';
   app.locals.ENV = env;
   app.locals.ENV_DEVELOPMENT = env == 'development';

   app.set('views', path.join(config.root, 'app', 'views'));
   app.engine('handlebars', exphbs({
      defaultLayout: 'main',
      layoutsDir: path.join('app', 'views', 'layouts'),
      partialsDir: path.join('app', 'views', 'partials')
   }));
   app.set('view engine', 'handlebars');

   //var mc = new mqttClient();
   mqttClient.setup();

   app.use(favicon(config.root + '/public/img/favicon.ico'));
   app.use(morgan('dev'));
   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({extended: true}));
   app.use(express.static(config.root + '/public'));

   // Register all routes
   var routes = glob.sync(config.root + '/app/routes/*.js');
   routes.forEach(function (route) {
      require(route)(app);
   });

   app.use(function (req, res, next) {
      var err = new Error('Not found : ' + req.path);
      err.status = 404;
      next(err);
   });

   if(app.get('env') === 'development'){
      app.use(function (err, req, res, next) {
         console.log(err);
         res.status(err.status || 500);
         res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
         });
      });
   }

   app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
         message: err.message,
         error: {},
         title: 'error'
      });
   });
};
