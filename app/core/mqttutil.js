/*
A module that provides MQTT functionalities.
*/

var _ = require('underscore');
var jsonfile = require('jsonfile');
var mqtt    = require('mqtt');
var printer = require('./printer');

mqttutil = function(){

   // The MQTT Client
   this.mqttClient = "";

   // MQTT Subsciption Topic
   this.topic = 'printch';

   this.subscribed = false;

   this.ps = {
      printNodeId: "",
      printerPort: "",
      printeServerIp: ""
   };

   this.oldps = {
      printNodeId: "",
      printerPort: "",
      printeServerIp: ""
   };

   // Setup printer port and print server IP
   this.setup= function(){
      var file = 'app/settings.json';
      var data = jsonfile.readFileSync(file);

      // Make a copy of old settings

      this.oldps = _.clone(this.ps);

      // Load new settings
      this.ps.printNodeId = data.printNodeId;
      this.ps.printerPort = data.ports[data.selectedPort];
      this.ps.printServerIp = data.printServerIp;

      console.log("old: "+ this.oldps.printServerIp);
      console.log("new: "+ this.ps.printServerIp);
      // If print server IP was changed then re-connect
      if( this.oldps.printServerIp != this.ps.printServerIp){
         this.connect();
      }
      else if(this.oldps.printNodeId != this.ps.printNodeId)
         this.subscribeToPrintChannel();
   };

   // Connect to Print Server
   this.connect= function(){
      this.mqttClient  = mqtt.connect('mqtt://' +  this.ps.printServerIp, {connectTimeout: 10*1000});
      this.mqttClient.on('error', function () {
         console.log("No connection to print broker at " + this.ps.printServerIp);
      });
      this.mqttClient.on('connect', this.subscribeToPrintChannel.bind(this));
   };

   // Subscribe to print channel
   this.subscribeToPrintChannel = function(){
      console.log("Connected to print broker at " + this.ps.printServerIp);
      var topic = this.topic + '/' + this.ps.printNodeId;
      var oldTopic = this.topic + '/' + this.oldps.printNodeId;

      var sub = function(){
         this.mqttClient.subscribe(topic);
         console.log("Sub to : " + topic);
         this.subscribed = true;
         this.mqttClient.on('message', this.processPrintRequest.bind(this));
      };

      if(this.subscribed){
         if(oldTopic != topic){
            this.mqttClient.unsubscribe(oldTopic, sub.bind(this));
         }
      }
      else{
         sub.bind(this)();
      }
   };

   // Is connected to Print Server
   this.isConnectedToPrintServer = function(){
      return this.mqttClient.connected;
   };

   // Process print request
   this.processPrintRequest =  function(topic, message){
      console.log(topic + " : "  + message.toString() );
      if(topic == (this.topic + '/' + this.ps.printNodeId) ){
         // TODO proceded only if message is in JSON format
         var payload = JSON.parse(message.toString());
         switch(payload.cmd){
            case "test":
               printer.testPrint(this.ps.printerPort, function(message){
                  console.log(message);
               });
               break;
            case "headtest":
               printer.testPrintHead(this.ps.printerPort, function(message){
                  console.log(message);
               });
               break;
            case "labelprint":
               printer.printLabel(this.ps.printerPort, payload, function(result){
                  console.log(result);
               });
               break;
         }

      }
   };
};

module.exports = new mqttutil();
