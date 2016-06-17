// import '../style.css';// 载入 style.css
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, combineReducers } from 'redux';

// 自定义
import Root from './components/Root';

import 'react-md-editor/dist/react-md-editor.css';
ReactDOM.render(<Root />, document.getElementById('root'));
