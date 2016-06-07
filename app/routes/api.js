var _ = require('underscore');
var express = require('express');
var jsonfile = require('jsonfile')
var printer = require('./../core/printer');

module.exports = function(app, mc){

   var router = express.Router();

   router.get('/appsettings', function(req, res) {
      var file = 'app/settings.json';
      var data = jsonfile.readFileSync(file);
      var ports = [];
      printer.getPorts(function(portList){
         if(portList.length > 0){
            portList.forEach(function(port) {
               ports.push(port.comName);
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

   // Test Print
   router.get('/testprint', function(req, res){
      var file = 'app/settings.json';
      var data = jsonfile.readFileSync(file);
      printer.testPrint(data.ports[data.selectedPort], function(message){
         res.send(message);
      });
   });

   router.get('/testprinthead', function(req, res){
      var file = 'app/settings.json';
      var data = jsonfile.readFileSync(file);
      printer.testPrintHead(data.ports[data.selectedPort], function(message){
         res.send(message);
      });
   });

   // Get Print Layouts
   router.get('/layouts', function(req, res){
      var data = ['layout1', 'layout2'];
      res.send(data);
   });

   // SAVE Application Settings Data
   router.post('/appsettings', function(req, res) {
      var file = 'app/settings.json';
      var data = jsonfile.readFileSync(file);
      var newData = req.body;
      jsonfile.writeFileSync(file, newData);
      if(data.printServerIp != newData.printServerIp){
         mc.connect();
      }
      res.send(req.body);
   });

   router.get('/error', function(req, res) {
      var data = {
         code: '101',
         mesage: 'This is a dummy error message'
      }
      res.status(500);
      res.send(data);
   });
   app.use('/api', router);
}

// GET Application Settings Data
