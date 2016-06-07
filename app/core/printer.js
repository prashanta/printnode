//var ezpl = require('./svg2ezpl');
var serialPort = require('serialport');

var printer = {
   printPrefix:
      "^E18\n"+   // Feed the pater to a specific position after printing (in mm).
      "^R2\n"+    // Set left margin
      "~Q+8\n"+   // Set top margin
      "^W70\n"+   // Set label width
      "^Q40,2,2\n",

   // Get list of available ports
   getPorts: function(callback){
      var portList = [];
      serialPort.list(function (err, ports) {
         if(ports.length > 0){
            // ports.forEach(function(port) {
            //    console.log(port.comName);
            //    console.log(port.pnpId);
            //    console.log(port.manufacturer);
            // });
            portList = ports;
         }
         callback(portList);
      });
   },

   // Print test page
   testPrint: function(port, callback){
      var sp = new serialPort.SerialPort(port, {baudrate: 9600}, false);
      sp.open(function (error) {
         if(error){
            console.log('failed to open: '+error);
            callback("Error opening COM port. Please check if printer is connected.");
         }
         else {
            sp.write("~V\n", function(err, results){
               console.log(results);
               sp.close();
               callback("Printing done");
            });
         }
      });
   },

   // Print test page
   testPrintHead: function(port, callback){
      var sp = new serialPort.SerialPort(port, {baudrate: 9600}, false);
      sp.open(function (error) {
         if(error){
            console.log('failed to open: '+error);
            callback("Error opening COM port. Please check if printer is connected.");
         }
         else {
            sp.write("~T\n", function(err, results){
               console.log(results);
               sp.close();
               callback("Printing done");
            });
         }
      });
   }


};

module.exports = printer;
