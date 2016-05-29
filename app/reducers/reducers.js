import { createStore, compose, combineReducers } from 'redux';

import {
	ReduxRouter,
	routerStateReducer,
	reduxReactRouter,
	push,
} from 'redux-router';

// 自定义 reducers
import jobsStateReducer from './jobs';
const reducer = combineReducers({
	router: routerStateReducer,
	jobs: jobsStateReducer
});


export default reducer;


