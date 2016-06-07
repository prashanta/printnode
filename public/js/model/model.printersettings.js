import Backbone from 'backbone';

export default class ModelPrinterSettings extends Backbone.Model {

   defaults() {
      return {
         printNodeId: '',
         printServerIp: '',
         ports: []
      }
   }

   url(){
      return '/api/printersettings';
   }
}
