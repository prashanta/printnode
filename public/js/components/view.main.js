/*jshint esversion: 6 */
'use strict';

import React  from 'react';
import Backbone  from 'backbone';
import {Tabs, Tab} from 'react-bootstrap';
import ViewManualPrinting from './view.manualprinting';
import ViewSettings from './view.settings';
import ViewAbout from './view.about';


export default class ViewMain extends React.Component{

   constructor(props) {
      super(props);
      this.state = {
         defaultTab: 1
      };
   }

   render(){
      return (
         <div>
            <Tabs defaultActiveKey={this.state.defaultTab} id="uncontrolled-tab-example">

               <Tab eventKey={1} title="Manual Printing">
                  <ViewManualPrinting />
               </Tab>

               <Tab eventKey={2} title="Settings">
                  <ViewSettings />
               </Tab>

               <Tab eventKey={3} title="About">
                  <ViewAbout />
               </Tab>

            </Tabs>
         </div>
      );
   }
}
