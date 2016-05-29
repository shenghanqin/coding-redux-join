/**
 * Created by hanqin on 16/5/29.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';


import * as JobsActions from '../actions';


class AddPage extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		event.preventDefault();
		const { dispatch } = this.props;
		console.log(typeof  dispatch, this.props);
		dispatch(JobsActions.createJob('Abcde' + Math.random()));

	}

	render() {

		let {jobs} = this.props;
		console.log(jobs);


		return (
			<div>
				{'AddPage Now'}
				<a href="#" onClick={this.handleClick}>新增职位 按钮</a>
			</div>
		)
	}
}

function mapStateToProps(state) {

	return {
		jobs: state.jobs
	}
}


export default connect(mapStateToProps)(AddPage);