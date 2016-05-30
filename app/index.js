import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, combineReducers } from 'redux';



import { Route, Link } from 'react-router';
import { Provider, connect } from 'react-redux';
import { devTools } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { createHistory } from 'history';

// 自定义
import Root from './components/Root';
ReactDOM.render(<Root />, document.getElementById('root'));
