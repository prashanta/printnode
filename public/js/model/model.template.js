import Backbone from 'backbone';

export default class LabelTemplate extends Backbone.Model {

   defaults() {
      return {
         svgData: ''
      }
   }
}
