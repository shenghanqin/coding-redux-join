import { createStore, compose, combineReducers } from 'redux';

import { Provider, connect } from 'react-redux';

import { devTools } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';



import { createHistory } from 'history';


import {
	ReduxRouter,
	routerStateReducer,
	reduxReactRouter,
	push,
} from 'redux-router';

export default function configureStore(initialState) {
	const reducer = combineReducers({
		router: routerStateReducer
	});
	const store = compose(
		reduxReactRouter({ createHistory }),
		devTools()
	)(createStore)(reducer);

	return store;



}


