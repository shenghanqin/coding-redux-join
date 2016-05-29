import { createStore, compose, combineReducers, applyMiddleware } from 'redux';

import { Provider, connect } from 'react-redux';

import { devTools } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';



import { createHistory } from 'history';

import thunkMiddleware from 'redux-thunk';
import reducer from '../reducers/reducers';


import {
	ReduxRouter,
	routerStateReducer,
	reduxReactRouter,
	push,
} from 'redux-router';

export default function configureStore(initialState) {
	const store = compose(
		applyMiddleware(thunkMiddleware),
		reduxReactRouter({ createHistory }),
		devTools()
	)(createStore)(reducer);

	return store;



}


