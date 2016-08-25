//var ezpl = require('./svg2ezpl');
var glob = require('glob');
var serialPort = require('serialport');
var path = require('path');
var fs = require('fs');
var logger = require('tracer').console();
var xmlParser = require('xml-parser');
var _ = require('underscore');
var svg2ezpl = require('./svg2ezpl');

var printer = function(){
   this.settings = {
      port: ''
   };

   this.status = { '00': 'Ready',
                  '01': 'Media Empty or Media Jam',
                  '02': 'Media Empty or Media Jam',
                  '03': 'Ribbon Empty',
                  '04': 'Door Open',
                  '05': 'Rewinder Full',
                  '06': 'File System Full',
                  '07': 'Filename Not Found',
                  '08': 'Duplicate Name',
                  '09': 'Syntax Error',
                  '10': 'Cutter Jam',
                  '11': 'Extended Memory Not Found',
                  '20': 'Pause',
                  '21': 'In Setting Mode',
                  '22': 'In Keyboard Mode',
                  '50': 'Printer is Printing',
                  '60': 'Data in Process'
               };

   this.commands = {
      selfTest : 'T~\n',
      printerHeadTest: '~V\n'
   };

   this.printPrefix =
      '^S2\n' +  // Speed setting
      '^H5\n' +  // Print darkness setting
      '^R26\n'+  // Set left margin
      '~R150\n'+  // Rotate printing
      '~Q-25\n'+   // (in dots) Row Offset Adjustment. +n move the start position downward, and the –n move the position upward
      '^W80\n'+   // Set label width
      '^Q52,2\n' +
      '^E20\n' +   // Feed paper to a specific position after printing (in mm).
      '^D0\n' +
      '^O0\n' +
      '^AD\n' +
      "^C1\n";      // Set number of copies
};

printer.prototype.getPorts = function(callback){
   var portList = [];
   console.log("Getting ports... ");
   serialPort.list(function (err, ports) {
      if(ports.length > 0){
         portList = ports;
      }
      callback(portList);
   });
};

printer.prototype.testPrint = function(callback){
   var sp = new serialPort.SerialPort(this.settings.port, {baudrate: 9600}, false);
   sp.open(function(error){
      if(error){
         callback({error: -1, message: "Error opening COM port. Please check if printer is connected."});
      }
      else {
         sp.write(this.commands.printerHeadTest, function(err, results){
            sp.close();
            callback("Printing done");
         });
      }
   }.bind(this));
};

// Print test page
printer.prototype.testPrintHead = function(callback){
   var sp = new serialPort.SerialPort(this.settings.port, {baudrate: 9600}, false);
   sp.open(function (error) {
      if(error){
         callback({error: -1, message: "Error opening COM port. Please check if printer is connected."});
      }
      else {
         sp.write(this.commands.selfTest, function(err, results){
            sp.close();
            callback("Printing done");
         });
      }
   }.bind(this));
};

printer.prototype.getPrinterStatus =  function(callback){
   var sp = new serialPort.SerialPort(this.settings.port, {baudrate: 9600, parser: serialPort.parsers.readline('\n')}, false);
   sp.open(function (error) {
      if(error){
         callback({error: -1, message: "Error opening COM port. Please check if printer is connected."});
      }
      else {
         sp.on('data', function (data) {
            var d = data.replace('\r', '');
            callback(this.status[d]);
            sp.close();
         }.bind(this));
         sp.write("^XSET,IMMEDIATE,1\n~S,CHECK\n", function(err, results){
         });
      }
   }.bind(this));
};

module.exports = new printer();
