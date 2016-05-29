import Wilddog from 'wilddog/lib/wilddog-node';
import * as ActionTypes from './constants/ActionTypes';

let wilddog=new Wilddog('https://redux-join.wilddogio.com');


export function createJob(text) {
	console.log('createJob2222', text);

	return (dispatch,getState)=>{

		wilddog.child('jobs').push({
			text
		},(err)=>{
			if(err){dispatch({type:ADD_TODO_ERROR,payload:err})}
		});



	}


	//return (dispatch,getState) => {
	//	console.log('createJob', text);
	//
	//}
}