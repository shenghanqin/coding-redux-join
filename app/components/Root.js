import React, { Component, PropTypes } from 'react';
import { createStore, compose, combineReducers } from 'redux';

import { Provider, connect } from 'react-redux';

import { devTools } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

// 自定义 router
import {Router, Route, IndexRedirect, useRouterHistory} from 'react-router';
import {createHashHistory} from 'history';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })




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
						<Router history={appHistory}>
							<Route path="/" component={App} >
								<IndexRedirect to='jobs' />
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