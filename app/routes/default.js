var express = require('express');
var babel = require("babel-core");
var router = express.Router();

module.exports = function (app) {
   app.use('/', router);
};

router.get('/help', function(req, res) {
   res.render('help');
});

router.get('/about', function(req, res) {
   res.render('about');
});
