//var ezpl = require('./svg2ezpl');
var glob = require('glob');
var serialPort = require('serialport');
var path = require('path');
var fs = require('fs');
var logger = require('tracer').console();
var xmlParser = require('xml-parser');
var _ = require('underscore');
var svg2ezpl = require('./svg2ezpl');
var Promise = require('bluebird');

var printer = {
   status : {  '00': 'Ready',
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
            },

   printPrefix: function(cp){
      return(
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
      '^C' + cp + '\n'); // Set number of copies
   },
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
            callback({error: -1, message: "Error opening COM port. Please check if printer is connected."});
         }
         else {
            sp.write("~V\n", function(err, results){
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
            callback({error: -1, message: "Error opening COM port. Please check if printer is connected."});
         }
         else {
            sp.write("~T\n", function(err, results){
               sp.close();
               callback("Printing done");
            });
         }
      });
   },

   // Get list of label templates and variables
   getLabelTemplates: function(callback){
      var templates = glob.sync(path.join(__dirname, '../','templates', '*.svg'));
      var data = [];
      templates.forEach(function (template) {
         // Open XML file and parse
         var xml = fs.readFileSync(template, 'utf8');
         var obj = xmlParser(xml);
         var att = [];
         // Get contents of all text children
         _.each(obj.root.children, function(child) {
            if(child.name === "text")
               att.push(child.content);
         });
         // Remove non variables
         att = _.filter(att, function(d){ return ((d.indexOf('{') > -1) && (d.indexOf('}') > -1))? 1 : 0; });
         // Strip curley brackets
         att = _.map(att, function(d){ return d.substring(d.lastIndexOf('{') + 1, d.lastIndexOf('}')); });
         var temp = {
            name: path.basename(template, '.svg'),
            attributes: att,
            svg: xml
         };
         data.push(temp);
      });
      callback(data);
   },

   printLabel: function(port, data, callback){
      var se = new svg2ezpl();
      var cp = data.copies || 1;
      var printData = this.printPrefix(cp) + se.getPrintCmd(data, data.template);
      var sp = new serialPort.SerialPort(port, {baudrate: 9600}, false);
      sp.open(function (error) {
         if(error){
            console.log('failed to open: '+error);
            callback({error: -1, message: "Error opening COM port. Please check if printer is connected."});
         }
         else {
            sp.write(printData, function(err, results){
               sp.close();
               callback("Printing done");
            });
         }
      });
   },

   printLabelBulk: function(port, jsondata, template, copies, callback){
      var se = new svg2ezpl();
      var cp = copies || 1;
      var sp = new serialPort.SerialPort(port, {baudrate: 9600}, false);

      sp.open(function (error) {
         if(error){
            console.log('failed to open: '+error);
            if(callback)
               callback({error: -1, message: "Error opening COM port. Please check if printer is connected."});
         }
         else {
            var promiseItems = [];
            for(var i=0; i<jsondata.length; i++){
               console.log(jsondata[i]);
               var printData = this.printPrefix(cp) + se.getPrintCmd(jsondata[i], template);
               promiseItems.push(this.writeToPort(printData, sp));
            }
            Promise.each(promiseItems, function(result, index, length){
               console.log('Printed ' + index + ' of ' + length);
            }.bind(this))
            .then(function(result){
               sp.close();
               if(callback)
                  callback("Bulk printing done");
            });
         }
      }.bind(this));
   },

   writeToPort: function(printData, sp){
      return new Promise(function(resolve, reject){
         sp.write(printData, function(err, results){
            resolve("done");
         });
      }.bind(this));
   },

   getPrinterStatus: function(port, callback){
      var sp = new serialPort.SerialPort(port, {baudrate: 9600, parser: serialPort.parsers.readline('\n')}, false);
      sp.open(function (error) {
         if(error){
            console.log('failed to open: '+error);
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
   }

};

module.exports = printer;
