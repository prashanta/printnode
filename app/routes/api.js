var _ = require('underscore');
var express = require('express');
var jsonfile = require('jsonfile');
var printer = require('./../core/printer');
var mqttClient  = require('./../core/mqttutil');
var fs = require('fs');
var path = require('path');
var multer  = require('multer');
var parse = require('csv-parse');
var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, './uploads');
   },
   filename: function (req, file, cb) {
      console.log(file);
      cb(null, file.originalname);
   }
});

var upload = multer({ storage: storage });

module.exports = function(app){

   var router = express.Router();
   //var mc = new mqttClient();
   /*
   * GET PRINTER SETTINGS
   * Returns printer and print server specific settings.
   */
   router.get('/printersettings', function(req, res) {
      var file = 'app/settings.json';
      var data = jsonfile.readFileSync(file);
      var ports = [];
      printer.getPorts(function(portList){
         console.log(printer.settings);
         if(portList.length > 0){
            portList.forEach(function(port) {
               ports.push(port.comName);
               //printer.settings.port = port.comName;
            });
         }
         else{
            ports.push("No Serial Ports Found");
         }
         if(ports.length <= data.selectedPort)
            data.selectedPort = 0;
         data.ports = ports;
         jsonfile.writeFileSync(file, data);
         res.send(data);
      });
   });

   /*
   * TEST PRINT
   */
   router.get('/testprint', function(req, res){
      var file = 'app/settings.json';
      var data = jsonfile.readFileSync(file);
      printer.testPrint(data.ports[data.selectedPort], function(result){
         if(result.error)
            res.status(500).send(result.message);
         else
            res.send(result.message);
      });
   });

   /*
   * TEST PRINT HEAD
   */
   router.get('/testprinthead', function(req, res){
      var file = 'app/settings.json';
      var data = jsonfile.readFileSync(file);
      printer.testPrintHead(data.ports[data.selectedPort], function(result){
         if(result.error)
            res.status(500).send(result.message);
         else
            res.send(result.message);
      });
   });

   /*
   * GET PRINT TEMPLATES
   */
   router.get('/layouts', function(req, res){
      var data = ['layout1', 'layout2'];
      res.send(data);
   });

   // GET PRINT SERVER STATUS
   router.get('/serverstat', function(req, res){
      res.send(mqttClient.isConnectedToPrintServer());
   });

   // GET TEMPLATES
   router.get('/templates', function(req, res){
      printer.getLabelTemplates(function(data){
         res.send(data);
      });
   });

   // SAVE APPLICATION SETTINGS
   router.post('/printersettings', function(req, res) {
      var file = 'app/settings.json';
      var data = jsonfile.readFileSync(file);
      var newData = req.body;
      jsonfile.writeFileSync(file, newData);
      //mc.setup();
      console.log(mqttClient.ps);
      mqttClient.setup();
      res.send(req.body);
   });

   // PRINT LABEL
   router.post('/print', function(req, res) {
      console.log(req.body);
      var data = jsonfile.readFileSync('app/settings.json');
      printer.printLabel(data.ports[data.selectedPort], req.body, function(result){
         if(result.error)
            res.status(500).send(result.message);
         else
            res.send(result);
      });
   });

   router.post('/bulk', upload.single('file'), function (req, res, next) {
      console.log(req.body);
      console.log(req.file);
      //var settings = jsonfile.readFileSync('settings.json');
      // open csv file
      var data = fs.readFileSync(path.join(req.file.destination, req.file.filename), 'utf8');
      // parse csv
      parse(data, {comment: '#'}, function(err, output){
         var keys = output[0];
         var jsondata = [];
         // change to json format
         for(var i=1; i<output.length; i++){
            var unit = {};
            var line = output[i];
            for(var j=0; j<keys.length; j++){
               unit[keys[j]] = line[j];
            }
            jsondata.push(unit);
         }
         var data = jsonfile.readFileSync('app/settings.json');
         printer.printLabelBulk(data.ports[data.selectedPort], jsondata, req.body.temp, req.body.copies, function(result){
            console.log(result);
         });
         // send to printer
      }.bind(this));
   });

   router.get('/printerstatus', function(req, res) {
      var data = jsonfile.readFileSync('app/settings.json');
      printer.getPrinterStatus(data.ports[data.selectedPort], function(result){
         if(result.error)
            res.status(500).send(result.message);
         else
            res.send(result);
      });
   });

   app.use('/api', router);
};
