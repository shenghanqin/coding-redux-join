import Wilddog from '../../node_modules/wilddog/lib/wilddog-node';
import * as ActionTypes from './../constants/ActionTypes';

let wilddog=new Wilddog('https://redux-join.wilddogio.com');


export function createJob(job) {

	return (dispatch,getState)=>{

		wilddog.child('jobs').push(job,(err)=>{
			if(err){dispatch({type:ADD_TODO_ERROR,payload:err})}
		});
	};


}

/*
 * action 创建函数
 */
export function getJobs() {
	return (dispatch, getState)=>{

		wilddog.child('jobs').once('value',(snapshot)=>{
			let obj=snapshot.val();
			let array=[];
			for(let key in obj){
				array.push(Object.assign({
					key: key
				}, obj[key]));

			}
			dispatch({
				type: ActionTypes.GET_JOB_OK,
				payload: array
			})
		},(err)=>{
			dispatch({
				type: ActionTypes.GET_JOB_ERROR,
				payload: err
			})
		});


	}
}


export function removeJob(key) {
	return (dispatch,getState)=>{
		wilddog.child(`jobs/${key}`).remove((err)=>{
			if(err)dispatch({type:ActionTypes.REMOVE_JOB_ERROR, payload:err})
		});


	}
}

export function registerListeners() {
	return (dispatch, getState) => {

		wilddog.child('jobs').on('child_removed', snapshot => {
			dispatch({
				type: ActionTypes.REMOVE_JOB_OK,
				payload: snapshot.key()
			})
		});

		wilddog.child('jobs').on('child_added', snapshot => {
					dispatch({
						type: ActionTypes.ADD_JOB_OK,
						payload: Object.assign({},snapshot.val(),{key:snapshot.key()})
					})
		});


	};
}