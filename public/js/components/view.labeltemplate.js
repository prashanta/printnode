/*jshint esversion: 6 */
'use strict';

import _ from 'underscore';
import React  from 'react';
import ReactDOM  from 'react-dom';
import Backbone  from 'backbone';
import BackboneReact from 'backbone-react-component';
import {Panel, Form, FormGroup, ControlLabel, FormControl, Button, Grid, Row, Col, Label, HelpBlock} from 'react-bootstrap';
import ModelPrinterSettings from './../model/model.printersettings';
import Radio  from 'backbone.radio';
import NotificationSystem from 'react-notification-system';
import SVGInline from "react-svg-inline"

export default class ViewLabelTemplate extends React.Component{

   constructor(props) {
      super(props);
      // this.state = {
      // };
      this.files = "";
      this.onPrint = this.onPrint.bind(this);
      this.onBulkPrint = this.onBulkPrint.bind(this);
   }

   componentWillMount(){
   }

   componentDidMount(){
      this._notificationSystem = this.refs.notificationSystem;
   }

   componentWillUnmount () {
   }

   onPrint(){
      var data = {};
      data.template = this.props.label.name;
      for(var i=0; i<this.props.label.attributes.length; i++) {
         var att = this.props.label.attributes[i];
         data[att] = ReactDOM.findDOMNode(this.refs[att]).value.trim();
         data["copies"] = ReactDOM.findDOMNode(this.refs.copies).value.trim();
         //ReactDOM.findDOMNode(this.refs[att]).value = "";
      }

      $.post('api/print', data, function(result){
         this._notificationSystem.addNotification({ message: result, level: 'success', position: 'tc'});
      }.bind(this))
      .fail(function(err){
         this._notificationSystem.addNotification({message: err.responseText, level: 'error', position: 'tc'});
      }.bind(this));
   }

   onBulkPrint(event){
      console.log(event.target.files)
      var el = ReactDOM.findDOMNode(this.refs.fileUpload);
      var formData = new FormData(el);
      var xhr = new XMLHttpRequest();
      // Add any event handlers here...
      xhr.open('POST', '/bulk', true);
      xhr.send(formData);

   }

   render(){
      return (
         <div style={{border: '1px solid #DDD', borderRadius: '7px', padding: '15px'}}>
            <Row className="clearfix">
               <Col sm={6}>
                  <Form horizontal>
                     {_.map(this.props.label.attributes,
                        function(att){
                           return (
                              <FormGroup key={"key_"+att} controlId="formHorizontal">
                                 <Col componentClass={ControlLabel} sm={2}>
                                    {att}
                                 </Col>
                                 <Col sm={10}>
                                    <FormControl ref={att} type="text"/>
                                 </Col>
                              </FormGroup>
                           );
                        }, this
                     )}
                     <hr />
                     <FormGroup key={"key__copies"} controlId="formHorizontal">
                        <Col componentClass={ControlLabel} sm={2}>
                           Copies
                        </Col>
                        <Col sm={10}>
                           <FormControl ref="copies" type="text"/>
                        </Col>
                     </FormGroup>

                  </Form>
               </Col>
               <Col sm={6}>
                  <SVGInline svg={this.props.label.svg} />
               </Col>
            </Row>
            <Button bsStyle="primary" onClick={this.onPrint}>Print</Button>
            <br/>
            <form ref="fileUpload" id='upload_form' action='Upload' method='post' encType='multipart/form-data'>
               <input name="temp" type="text" value={this.props.label.name} style={{'display':'none'}}/>
               <input id="file"  type="file" name="file" size="50" onChange={this.onBulkPrint} />
            </form>
            <NotificationSystem ref="notificationSystem" />
         </div>
      );
   }
}
