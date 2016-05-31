/**
 * Created by hanqin on 16/5/29.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import * as JobsActions from '../actions';

import { Forms, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';


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
				<form>
					<FormGroup
							controlId="formBasicText"

					>
						<ControlLabel>Working example with validation</ControlLabel>
						<FormControl
								type="text"

								placeholder="Enter text"
								onChange={this.handleChange}
						/>
						<FormControl.Feedback />
						<HelpBlock>Validation is based on string length.</HelpBlock>
					</FormGroup>
				</form>
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