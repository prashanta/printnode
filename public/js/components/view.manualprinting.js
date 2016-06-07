'use strict';

import _ from 'underscore';
import React  from 'react';
import Backbone  from 'backbone';
import BackboneReact from 'backbone-react-component';
import {Panel, FormGroup, ControlLabel, FormControl, Button, Col, HelpBlock} from 'react-bootstrap';
import ModelAppSettings from './../model/model.appsettings';
import Radio  from 'backbone.radio';

export default class ViewSettings extends React.Component{

   constructor(props) {
      super(props);
      this.state = {
      }

      this.oc = Radio.channel('overlay');
      this.handleTestPrint = this.handleTestPrint.bind(this);
      this.handleTestPrintHead = this.handleTestPrintHead.bind(this);
   }

   componentWillMount(){
   }

   componentDidMount(){
   }

   componentWillUnmount () {
   }

   handleTestPrint(){
      $.get('/api/testprint');
   }

   handleTestPrintHead(){
      $.get('/api/testprinthead');
   }

   render(){
      return (
         <div>
            <div className="tab_content container">
               <Button onClick={this.handleTestPrint} bsStyle="success">Test Print</Button>
               <br/>
               <Button onClick={this.handleTestPrintHead} bsStyle="success">Test Print Head</Button>
            </div>
         </div>
      );
   }
}
