/*
A module that provides MQTT functionalities.
*/

var jsonfile = require('jsonfile')
var mqtt    = require('mqtt');
var printer = require('./printer');

module.exports = function(){
   this.mqttClient = "";

   this.connect= function(ip){
      console.log("connecting to mothership ....");
      var file = 'app/settings.json';
      var data = jsonfile.readFileSync(file);

      this.mqttClient  = mqtt.connect('mqtt://' +  data.printServerIp, {connectTimeout: 10*1000});

      this.mqttClient.on('error', function () {
         console.log("No connection to mothership!");
      });

      this.mqttClient.on('connect', this.subscribeToPrintChannel.bind(this));


   };

   this.subscribeToPrintChannel = function(){
      console.log("Connected to mothership!");
      this.mqttClient.subscribe('printch');
      this.mqttClient.on('message', function (topic, message) {
         console.log("I print stuff");
         var file = 'app/settings.json';
         var data = jsonfile.readFileSync(file);
         printer.testPrint(data.ports[data.selectedPort], function(message){
            console.log(message);
         });
      });
   }
}
