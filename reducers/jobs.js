import { combineReducers } from 'redux'
 import { ADD_JOB_OK} from './../actions'

import * as ActionTypes from '../constants/ActionTypes';

function jobs(state=[
  {title: 'ABC'}
], action) {
  switch (action.type) {
    // case GET_TODO_OK:
    //   return action.payload
    // case ADD_TODO_OK:
    //   return [
    //     ...state,
    //     action.payload
    //   ]
    // case REMOVE_TODO_OK:
    //   return state.filter((todo)=>todo.key!==action.payload
    //   )
      case ActionTypes.ADD_JOB_OK:
        return [
          ...state,
          {
            title: parseInt(100 * Math.random()) + 100
          }
        ];
    default:
      return state
  }
}

// const todoApp = combineReducers({
//   todos
// })

export default jobs