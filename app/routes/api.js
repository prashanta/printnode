var _ = require('underscore');
var express = require('express');
var jsonfile = require('jsonfile')
var printer = require('./../core/printer');

module.exports = function(app, mc){

   var router = express.Router();

   /*
   * GET PRINTER SETTINGS
   * Returns printer and print server specific settings.
   */
   router.get('/printersettings', function(req, res) {
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

   /*
   * TEST PRINT
   */
   router.get('/testprint', function(req, res){
      var file = 'app/settings.json';
      var data = jsonfile.readFileSync(file);
      printer.testPrint(data.ports[data.selectedPort], function(message){
         res.send(message);
      });
   });

   /*
   * TEST PRINT HEAD
   */
   router.get('/testprinthead', function(req, res){
      var file = 'app/settings.json';
      var data = jsonfile.readFileSync(file);
      printer.testPrintHead(data.ports[data.selectedPort], function(message){
         res.send(message);
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
      res.send(mc.isConnectedToPrintServer());
   });

   // SAVE APPLICATION SETTINGS
   router.post('/printersettings', function(req, res) {
      var file = 'app/settings.json';
      var data = jsonfile.readFileSync(file);
      var newData = req.body;
      jsonfile.writeFileSync(file, newData);
      mc.setup();
      res.send(req.body);
   });

   app.use('/api', router);
}
