'use strict';

import React  from 'react';
import Backbone  from 'backbone';

export default class PrintLayout extends React.Component{

   constructor(props) {
      super(props);
   }

   render(){
      return (
         <div className='container-fluid'>
            <div className="row">
               <div className="col-lg-2">.col-md-1</div>
               <div className="col-lg-10">.col-md-1</div>
            </div>
         </div>
      );
   }
}
