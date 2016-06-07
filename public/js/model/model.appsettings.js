import Backbone from 'backbone';

export default class ModelAppSettings extends Backbone.Model {

   defaults() {
      return {
         printerNodeId: '',
         printServerIp: '',
         ports: []
      }
   }

   url(){
      return '/api/appsettings';
   }
}
