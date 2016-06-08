/**
 * Created by hanqin on 16/5/29.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import * as JobsActions from '../actions/actions';

import { Forms, FormGroup, ControlLabel, FormControl, HelpBlock, Grid, Row, Col, Button} from 'react-bootstrap';

import {reduxForm} from 'redux-form';
export const fields = [ 'jobTitle', 'jobStatus', 'jobTitleSlug'];

// import joi from 'joi';
import validation from 'react-validation-mixin'; //import the mixin
// import strategy from 'react-validatorjs-strategy';

const asyncValidate = (values, dispatch) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
		console.log('values', values);
		if(!values.jobTitleSlug) {
			console.log(  values.jobTitle.toUpperCase());
        	// reject({'jobTitle':  values.jobTitle.toUpperCase()})
        	resolve({'jobTitle': values.jobTitle.toUpperCase()})
		} else {
		}
    }, 1000) // simulate server latency
  })
}


const validate = values => {
	const errors = {}
	if (!values.jobTitle) {
		errors.jobTitle = '必填'
	} else if (values.jobTitle.length > 15) {
		errors.jobTitle = '职位名称不能超过20个字'
	}

	if (!values.jobStatus) {
		errors.jobStatus = '请选择职位热度'
	}
	return errors
}

class AddPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			jobTitle: '',
			jobTitleSlug: '',
			jobStatus: ''
		};

		this.handleSubmitMe = this.handleSubmitMe.bind(this);
		// this.handleTitleChange = this.handleTitleChange.bind(this);
		// this.handleStatusChange = this.handleStatusChange.bind(this);
	}


	handleSubmitMe(job) {
		console.log(job);
		const { dispatch } = this.props;
			dispatch(JobsActions.createJob(job));

	}

	handleTitleChange(event) {
		console.log('handleTitleChange');
		console.log(this.props.fields.jobTitle);
	}

	render() {

		let {jobs} = this.props;
		const { fields: { jobTitle, jobStatus, jobTitleSlug }, resetForm, handleSubmit, submitting, asyncValidating } = this.props;
		console.log('this.props', this.props);
		let jobStatusCN = {
			'0': '请选择职位热度',
			'new': '热门',
			'normal': '普通'
		};
		return (
				<div>
					<Grid>
						<p>123-{asyncValidating == 'jobTitle' && <i>32423</i>} - {asyncValidating}</p>
						<h1 className='page-header' onClick={this.handleClick}>新增职位 </h1>
						<Row className="show-grid">
							<Col xs={12} md={6}>
								<form onSubmit={handleSubmit(this.handleSubmitMe.bind(this))}>
									<FormGroup
											controlId="jobTitle" validationState={jobTitle.touched && jobTitle.error && 'warning'}
									>
										<ControlLabel>职位名称</ControlLabel>
										<FormControl
												type="text"
												placeholder="请输入职位名称"
												 {...jobTitle}
										/>
										<FormControl.Feedback />
										{jobTitle.touched && jobTitle.error && <HelpBlock>{jobTitle.error}</HelpBlock>}
									</FormGroup>
									<FormGroup>
										<ControlLabel>职称拼音</ControlLabel>
										<FormControl
												type="text"
												placeholder="请输入职称拼音"
												 {...jobTitleSlug}
										/>
									</FormGroup>
									<FormGroup controlId="jobStatus"  validationState={jobStatus.touched && jobStatus.error && 'warning'}>
										<ControlLabel>职位热度</ControlLabel>
										<FormControl componentClass="select" placeholder="" {...jobStatus}>
											<option value="">请选择职位热度...</option>
											<option value="new">热门</option>
											<option value="normal">普通</option>
										</FormControl>
										{jobStatus.touched && jobStatus.error && <HelpBlock>{jobStatus.error}</HelpBlock>}
									</FormGroup>
									<Button type="submit" >
										&nbsp;&nbsp;提交&nbsp;&nbsp;
									</Button>
								</form>
							</Col>
							<Col xs={12} md={6}>
								<p>职位名称: {jobTitle.value || '请输入职位名称'} </p>
								<p>职位拼音: {jobTitleSlug.value}</p>
								<p>职位类型: {jobStatusCN[jobStatus.value]}</p>
							</Col>
						</Row>
					</Grid>


				</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		jobs: state.jobs
	}
}
export default connect(mapStateToProps)(reduxForm({
	form: 'addValidation',
	fields,
	validate,
	asyncValidate,
	asyncBlurFields: ['jobTitle', 'jobTitleSlug']
})(AddPage));