import { combineReducers } from 'redux'
 //import { ADD_JOB_OK} from '../actions/actions'

import * as ActionTypes from '../constants/ActionTypes';

function jobs(state=[], action) {
  //console.log(action);
  //console.log('GET_JOB_OK', ActionTypes.GET_JOB_OK);
  switch (action.type) {
     case ActionTypes.GET_JOB_OK:
       //console.log('action.payload',  action.payload);
       return action.payload;
     case ActionTypes.ADD_JOB_OK:
       console.log('add job OK');
       return [
         ...state,
         action.payload
       ];
     case ActionTypes.REMOVE_JOB_OK:
       return state.filter(
         (job)=>job.key!==action.payload
       );

    default:
      return state
  }
}

// const todoApp = combineReducers({
//   todos
// })

export default jobs