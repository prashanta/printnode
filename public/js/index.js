/*jshint esversion: 6 */
'use strict';

import $ from 'jquery';
import jQuery from 'jquery';
window.$ = window.jQuery = $;

import Backbone from 'backbone';
import React from 'react';
import ReactDOM from 'react-dom';

var bootstrap = require('bootstrap');

import Layout from './components/layout';

ReactDOM.render(<Layout/>, document.getElementById('container'));
