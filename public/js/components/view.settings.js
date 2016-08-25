/*jshint esversion: 6 */
'use strict';

import _ from 'underscore';
import React  from 'react';
import Backbone  from 'backbone';
import BackboneReact from 'backbone-react-component';
import {Panel, FormGroup, ControlLabel, FormControl, Button, Grid, Row, Col, Label, HelpBlock} from 'react-bootstrap';
import ModelPrinterSettings from './../model/model.printersettings';
import Radio  from 'backbone.radio';
import NotificationSystem from 'react-notification-system';

export default class ViewSettings extends React.Component{

   constructor(props) {
      super(props);
      this.state = {
         text1ValidationState : "success",
         text2ValidationState : "success",
         serverStatus: false,
         printerStatus: ''
      };

      this.printersettings = new ModelPrinterSettings();

      this.handleTextChange = this.handleTextChange.bind(this);
      this.handlePortSelect = this.handlePortSelect.bind(this);
      this.handleCheckServerStatus = this.handleCheckServerStatus.bind(this);
      this.handleCheckPrinterStatus = this.handleCheckPrinterStatus.bind(this);
      this.handleSave = this.handleSave.bind(this);
      this.handleTestPrint = this.handleTestPrint.bind(this);
      this.handleTestPrintHead = this.handleTestPrintHead.bind(this);

      this.oc = Radio.channel('overlay');

      this.printersettings.on('sync', function(){
         this.oc.trigger("overlay:hide");
         this.handleCheckServerStatus();
      }, this);
   }

   componentWillMount(){
      BackboneReact.on(this,{
         models: {
            appsettings: this.printersettings
         }
      });
   }

   componentDidMount(){
      this._notificationSystem = this.refs.notificationSystem;
      this.printersettings.fetch();
      this.oc.trigger("overlay:show");
      this.handleCheckServerStatus();
   }

   componentWillUnmount () {
      backboneReact.off(this);
   }

   handleTextChange(e){
      var val = e.target.value;
      var temp = this.state.appsettings;
      if(e.target.id == "nodeId"){
         if(val.length < 3){
            this.setState({text1ValidationState: "error"});
         }else {
            this.setState({text1ValidationState: "success"});
         }
         temp.printNodeId = val;
      }
      else{
         if(val.length <= 0)
            this.setState({text2ValidationState: "error"});
         else
            this.setState({text2ValidationState: "success"});
         temp.printServerIp = val;
      }
      this.setState({appsettings: temp});
   }

   handlePortSelect(e){
      var val = e.target.value;
      var temp = this.state.appsettings;
      temp.selectedPort = temp.ports.indexOf(val);
      this.setState({appsettings: temp});
   }

   handleCheckServerStatus(){
      this.setState({serverStatus: 'Checking ...'});
      $.get('/api/serverstat', function(data){
         this.setState({serverStatus: data? "Connected" : "Disconnected"});
      }.bind(this));
      //TODO Annunciate print server connection status
   }

   handleCheckPrinterStatus(){
      this.setState({printerStatus: 'Checking ...'});
      $.get('/api/printerstatus', function(data){
         this.setState({printerStatus: data});
      }.bind(this));
   }

   handleSave(){
      this.oc.trigger("overlay:show");
      this.printersettings.save();
   }

   handleTestPrint(){
      $.get('/api/testprint', function(data){

      })
      .fail(function(err){
         this._notificationSystem.addNotification({
            message: err.responseText,
            level: 'error',
            position: 'tc',
         });
      }.bind(this));
   }

   handleTestPrintHead(){
      $.get('/api/testprinthead')
      .fail(function(err){
         this._notificationSystem.addNotification({
            message: err.responseText,
            level: 'error',
            position: 'tc',
         });
      }.bind(this));;
   }

   render(){
      var selectedPort = this.state.appsettings.ports[this.state.appsettings.selectedPort];
      return (
         <div>
            <div className="tab_content container">
               <Grid>
                  <Row>
                     <Col xs={6} md={4}>
                           <FormGroup controlId="nodeId" validationState={this.state.text1ValidationState}>
                              <ControlLabel>Printer Node ID</ControlLabel>
                              <FormControl type="text" value={this.state.appsettings.printNodeId}
                              onChange={this.handleTextChange}/>
                              <HelpBlock>Must be greater than 3 characters</HelpBlock>
                           </FormGroup>

                           <FormGroup controlId="serverIp"
                           validationState={this.state.text2ValidationState}>
                              <ControlLabel>Printer Broker IP</ControlLabel>
                              <FormControl type="text" value={this.state.appsettings.printServerIp}
                              onChange={this.handleTextChange}/>
                              <HelpBlock>Example: 192.0.79.33</HelpBlock>
                           </FormGroup>

                           <FormGroup controlId="formControlsSelect">
                              <ControlLabel>Printer Port</ControlLabel>
                              <FormControl componentClass="select" placeholder="select" value={selectedPort}
                              onChange={this.handlePortSelect}>
                              {
                                 this.state.appsettings.ports.map(function(port, index){
                                    return <option key={index} value={port}>{port}</option>
                                 })
                              }
                              </FormControl>
                           </FormGroup>

                           <FormGroup>
                              <Button onClick={this.handleSave} bsStyle="success">Save</Button>
                              <br/>
                              <br/>
                              <Button onClick={this.handleCheckServerStatus} bsStyle="success">Check Server Status</Button>
                              &nbsp;Print Broker: <Label bsStyle='default'>{this.state.serverStatus}</Label>
                              <br/>
                              <br/>
                              <Button onClick={this.handleCheckPrinterStatus} bsStyle="success">Check Printer Status</Button>
                              &nbsp;Printer Status: <Label bsStyle="default">{this.state.printerStatus}</Label>
                           </FormGroup>
                     </Col>
                     <Col xs={6} md={8}>
                        <Button onClick={this.handleTestPrint} bsStyle="success">Test Print</Button>
                        <br/>
                        <Button onClick={this.handleTestPrintHead} bsStyle="success">Test Print Head</Button>
                     </Col>
                  </Row>
               </Grid>


            </div>
            <NotificationSystem ref="notificationSystem" />
         </div>
      );
   }
}
