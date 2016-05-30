import React, { Component, PropTypes } from 'react';
import { createStore, compose, combineReducers } from 'redux';

import { Provider, connect } from 'react-redux';

import { devTools } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

//import { createHistory } from 'history';
//import { Route, Link } from 'react-router';
import {
	ReduxRouter,
	routerStateReducer,
	reduxReactRouter,
	push,
} from 'redux-router';

// 自定义 router
import {Router, Route, IndexRedirect} from 'react-router';
import createHistory from 'history/lib/createHashHistory';
const history = createHistory({
	queryKey: false
});



import App from './App';
import Parent from './Parent';
import Child from './Child';
import Joblist from './JobListP';
import AddPage from '../containers/AddPage';

import configureStore from '../store/Store';

const store = configureStore();

class Root extends Component {
	render() {
		return (
				<div>
					<Provider store={store}>
						<Router history={history}>
							<Route path="/" component={App} >
								<Route path="jobs" component={Joblist}></Route>
								<Route path="add" component={AddPage}></Route>
							</Route>
						</Router>

					</Provider>
					<DebugPanel top right bottom>
						<DevTools store={store} monitor={LogMonitor} />
					</DebugPanel>
				</div>
		);
	}
};


export default Root;