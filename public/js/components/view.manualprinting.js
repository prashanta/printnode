/*jshint esversion: 6 */
'use strict';

import _ from 'underscore';
import React  from 'react';
import Backbone  from 'backbone';
import BackboneReact from 'backbone-react-component';
import {Tabs, Tab, Row, Col, Nav, NavItem, Button} from 'react-bootstrap';
import Radio  from 'backbone.radio';
import NotificationSystem from 'react-notification-system';
import Templates from './../collection/template';
import TemplateView from './view.labeltemplate';

export default class ViewManualPrinting extends React.Component{

   constructor(props) {
      super(props);
      this.state = {
         templates: []
      };
      this.oc = Radio.channel('overlay');

      this.templates = new Templates();
      this.templates.on('sync', function(){
      }, this);
   }

   componentWillMount(){
      BackboneReact.on(this,{
         collections: {
            templates: this.templates
         }
      });
   }

   componentDidMount(){
      this._notificationSystem = this.refs.notificationSystem;
      this.templates.fetch();
   }

   componentWillUnmount () {
   }

   getTemplateViews(){
      return(
         this.state.templates.map(
            function(template){
               return <TemplateView label={template} />;
            }
         )
      );
   }

   render(){
      return (
         <div>
            <div className="tab_content container">
               <Tab.Container id="lable-template-list" defaultActiveKey="first">
                  <Row className="clearfix">
                     <Col sm={3}>
                        <Nav bsStyle="pills" stacked>
                           {this.state.templates.map(
                              function(template){
                                 return (
                                    <NavItem eventKey={template.name}>
                                       {template.name}
                                    </NavItem>
                                 );
                              }
                           )}
                        </Nav>
                     </Col>
                     <Col sm={9}>
                        <Tab.Content animation>
                           {this.state.templates.map(
                              function(template){
                                 return (
                                    <Tab.Pane eventKey={template.name}>
                                       <TemplateView label={template} />
                                    </Tab.Pane>
                                 );
                              }
                           )}
                        </Tab.Content>
                     </Col>
                  </Row>
               </Tab.Container>
            </div>
            <NotificationSystem ref="notificationSystem" />
         </div>
      );
   }
}
