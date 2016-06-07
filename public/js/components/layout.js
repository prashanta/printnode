'use strict';

import React  from 'react';
import Backbone  from 'backbone';
import backboneReact from 'backbone-react-component';
import Header from './header';
import ViewMain from './view.main';
import Overlay from './overlay';
import MyModel from '../model/mymodel';
import AppConfig from '../config';
import Radio  from 'backbone.radio';

var appconfig = new AppConfig();

export default class Layout extends React.Component{

   constructor(props) {
      super(props);
      this.state = {
         overlay: false
      }
      this.checkIsNewVersion = this.checkIsNewVersion.bind(this);

      this.oc = Radio.channel('overlay');
      this.oc.on('overlay:show', function(){
         this.setState({overlay: true});
      }, this);

      this.oc.on('overlay:hide', function(){
         this.setState({overlay: false});
      }, this);
   }

   componentDidMount(){
      this.checkIsNewVersion();
   }

   checkIsNewVersion(){
      var newVer = appconfig.ver;
      var oldVer = localStorage.getItem('appver');
      if(oldVer){
         if( oldVer == newVer)
            console.log('Version is same');
         else
            console.log('Version is different!');
      }
      else{
         console.log('Version added');
         localStorage.setItem('appver', newVer);
      }
   }

   render(){
      return (
         <div>
            <Overlay show={this.state.overlay}/>
            <Header title={appconfig.title} ver={appconfig.ver}/>
            <ViewMain />
         </div>
      );
   }
}
