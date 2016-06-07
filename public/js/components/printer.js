var ezpl = require('./svg2ezpl');
var serialPort = require('serialport');

var events = require('events');

var printer = {
    getPorts: function(callback){
        var portlist = [];
        serialPort.list(function (err, ports) {
            console.log("Printing port details... ");
            ports.forEach(function(port) {
                console.log(port.comName);
                console.log(port.pnpId);
                console.log(port.manufacturer);
            });
            portlist = ports;
            callback(portlist);
        });
    }
};

module.exports = printer;
