'use strict';

import React  from 'react';
import Backbone  from 'backbone';

export default class Header extends React.Component{

   constructor(props) {
      super(props);
   }

   render(){
      return (
         <div>
            <nav className="navbar navbar-default">
               <div className="container-fluid">
                  <div className="navbar-header">
                     <div className="navbar-brand">
                        <b>{this.props.title}</b>&nbsp;&nbsp;<sup>{this.props.ver}</sup>
                     </div>
                  </div>
                  <div className="navbar-right">
                     <span className="logo"></span>
                  </div>
               </div>
            </nav>
         </div>
      );
   }
}
