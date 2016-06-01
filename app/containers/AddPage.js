/**
 * Created by hanqin on 16/5/29.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import * as JobsActions from '../actions/actions';

import { Forms, FormGroup, ControlLabel, FormControl, HelpBlock, Grid, Row, Col, Button} from 'react-bootstrap';


class AddPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			jobTitle: '',
			jobStatus: ''
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleStatusChange = this.handleStatusChange.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		const { dispatch } = this.props;
		//console.log(this.state.jobTitle);
		//console.log(typeof  dispatch, this.props);
		//console.log(this.state);
		dispatch(JobsActions.createJob(this.state));

		this.setState({
			jobTitle: '',
			jobStatus: ''
		});
	}

	handleTitleChange(event) {
		if (!!event.target.value) {
			this.setState({
				jobTitle: event.target.value
			});
			//console.log(this.state.jobTitle);
		}
		//console.log(event.target.value);
	}

	handleStatusChange(event) {
		if (!!event.target.value) {
			this.setState({
				jobStatus: event.target.value
			});
			//console.log(this.state.jobTitle);
		}
		console.log(event.target.value);
	}

	render() {

		let {jobs} = this.props;
		//console.log(this);
		return (
				<div>
					<Grid>
						<h1 className='page-header' onClick={this.handleClick}>新增职位</h1>
						<Row className="show-grid">
							<Col xs={12} md={6}>
								<form onSubmit={this.handleSubmit}>
									<FormGroup
											controlId="formBasicText"
									>
										<ControlLabel>职位名称</ControlLabel>
										<FormControl
												type="text"
												placeholder="请输入职位名称"
												onChange={this.handleTitleChange}
										/>
										<FormControl.Feedback />
										<HelpBlock>Validation is based on string length.</HelpBlock>
									</FormGroup>
									<FormGroup controlId="formControlsSelect">
										<ControlLabel>职位热度</ControlLabel>
										<FormControl componentClass="select" placeholder="" onChange={this.handleStatusChange}>
											<option value="0">请选择职位热度...</option>
											<option value="new">热门</option>
											<option value="old">普通</option>
										</FormControl>
									</FormGroup>
									<Button type="submit" >
										&nbsp;&nbsp;提交&nbsp;&nbsp;
									</Button>
								</form>
							</Col>
							<Col xs={12} md={6}></Col>
						</Row>
					</Grid>


				</div>
		)


		console.log(jobs);
	}
}

function mapStateToProps(state) {

	return {
		jobs: state.jobs
	}
}


export default connect(mapStateToProps)(AddPage);