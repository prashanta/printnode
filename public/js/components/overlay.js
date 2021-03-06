'use strict';

import React  from 'react';
import Backbone  from 'backbone';

export default class Overlay extends React.Component{

   constructor(props) {
      super(props);
   }

   render(){
      var style = {display: this.props.show? 'block' : 'none'};
      return (
         <div className='overlay' style={style}>
            <br/>
            <center><i className="fa fa-cog fa-spin"></i></center>
         </div>
      );
   }
}
