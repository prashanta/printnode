import Backbone from 'backbone';

export default class MoModel extends Backbone.Model {

   defaults() {
      return {
         name: '',
         location: ''
      }
   }

   url(){
      return '/api/testdata';
   }
}
