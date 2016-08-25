'use strict';

import _ from 'underscore';
import React  from 'react';
import Backbone  from 'backbone';
import BackboneReact from 'backbone-react-component';

export default class ViewSettings extends React.Component{

   constructor(props) {
      super(props);
      this.state = {
      };
   }

   componentWillMount(){
   }

   componentDidMount(){
   }

   componentWillUnmount () {
   }

   render(){
      return (
         <div>
            <div className="tab_content container">
               <b>PrintNode</b> is a web based app to configure, test and print bar codes and labels.
            </div>
         </div>
      );
   }
}
