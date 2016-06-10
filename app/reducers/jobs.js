import { combineReducers } from 'redux'
 //import { ADD_JOB_OK} from '../actions/actions'

import * as ActionTypes from '../constants/ActionTypes';

function jobs(state=[], action) {
  switch (action.type) {
     case ActionTypes.GET_JOB_OK:
       return action.payload;
     case ActionTypes.ADD_JOB_OK:
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