import Backbone from 'backbone';
import Template from '../model/model.template';

export default class CollectionTemplate extends Backbone.Collection {

   constructor(options) {
      super(options);
      this.model = Template;
   }

   url(){
      return '/api/templates';
   }
}
