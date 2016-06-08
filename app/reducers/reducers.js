import { createStore, compose, combineReducers } from 'redux';

import {reducer as formReducer} from 'redux-form';

// 自定义 reducers
import jobsStateReducer from './jobs';
const reducer = combineReducers({
	//router: routerStateReducer,
	jobs: jobsStateReducer,
	// ... your other reducers here ...
	form: formReducer     // <---- Mounted at 'form'. See note below.
});


export default reducer;


