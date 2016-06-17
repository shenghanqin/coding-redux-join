/**
 * Created by hanqin on 16/5/29.
 */
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as JobsActions from '../actions/actions';

import { findDOMNode } from 'react-dom'

import { Forms, FormGroup, ControlLabel, FormControl, HelpBlock, Grid, Row, Col, Button} from 'react-bootstrap';

// export const fields = [ 'jobTitle', 'jobStatus', 'jobTitleSlug'];

// import joi from 'joi';
import validation from 'react-validation-mixin'; //import the mixin
import strategy from 'react-validatorjs-strategy';

import ReactDOM from 'react-dom';
import marked from 'marked';

import Editor from 'react-md-editor';
import 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';
import 'react-md-editor/dist/react-md-editor.css';
// var css = required('react-md-editor/dist/react-md-editor.css');
// var css = require("!css!less!react-md-editor/dist/component.less");

// 拼音转换
import pinyin from 'pinyin';

class AddPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			jobContentHTML: '',
			jobContent: ''
		};

		this.validatorTypes = strategy.createSchema(
			// First parameter is a list of rules for each element name
			{
				jobTitle: 'required|min:3|max:20',
				jobTitleSlug: 'required|min:3|max:20',
				jobStatus: 'required',
				jobContent: 'required|min:3'
			},
			// Second parameter is optional and is a list of custom error messages for elements
			{
				"required.jobTitle": "职位名称必填",
				"min.jobTitle": "职位名称长度不小于3字，不超过20个字",
				"max.jobTitle": "职位名称长度不小于3字，不超过20个字",
				"required.jobTitleSlug": "职位名称拼音必填",
				"min.jobTitleSlug": "职位名称拼音长度不小于3字，不超过20个字",
				"max.jobTitleSlug": "职位名称拼音长度不小于3字，不超过20个字",
				"required.jobStatus": "职位状态必选",
				"required.jobContent": "职位内容必填",
				"min.jobContent": "职位内容不得少于三个字"
			}
		);

		this.getValidatorData = this.getValidatorData.bind(this);
		this.handleSubmitMe = this.handleSubmitMe.bind(this);
		this.activateValidation = this.activateValidation.bind(this);
		// this.handleChange = this.handleChange.bind(this);
		this.handleTitleBlur = this.handleTitleBlur.bind(this);
		this.resetForm = this.resetForm.bind(this);
		this.handleContentChange = this.handleContentChange.bind(this);
		this.updateCode = this.updateCode.bind(this);
	}

	resetForm() {
		findDOMNode(this.refs.jobTitle).value = '';
		findDOMNode(this.refs.jobTitleSlug).value = '';
		findDOMNode(this.refs.jobStatus).value = '';
		findDOMNode(this.refs.jobContent).value = '';
	}
	getValidatorData() {
		return {
			jobTitle: findDOMNode(this.refs.jobTitle).value,
			jobTitleSlug: findDOMNode(this.refs.jobTitleSlug).value,
			jobStatus: findDOMNode(this.refs.jobStatus).value,
			jobContent: findDOMNode(this.refs.jobContent).value
		}
	}


	handleSubmitMe(event) {
		var self = this;
		event.preventDefault();
		this.props.validate(function (error) {
			if (!error) {
				const { dispatch } = self.props;
				self.props.createJob(self.getValidatorData());
				self.resetForm();
				// Submit the data
			}
		})

	}

	handleTitleBlur(event) {
		let _jobTitleSlug = findDOMNode(this.refs.jobTitleSlug).value;
		if(!_jobTitleSlug) {
			var jobTitlePinyinArr = pinyin(findDOMNode(this.refs.jobTitle).value, {
				style: pinyin.STYLE_NORMAL,
				segment: true
			});
			var jobTitlePinyin = jobTitlePinyinArr.map((v, i)=> v[0].trim()).join('-').toLowerCase();
			findDOMNode(this.refs.jobTitleSlug).value = jobTitlePinyin;
		}
		this.props.handleValidation(event.target.name)(event);
	}

	activateValidation(e) {
		strategy.activateRule(this.validatorTypes, e.target.name);
		this.props.handleValidation(e.target.name)(e);
	}

	handleContentChange(event) {
		var rawMarkup = marked(event.target.value, {sanitize: true});
        // return {__html: rawMarkup};
		this.setState({
			jobContentHTML: rawMarkup
		})
	}

	updateCode(text) {
		// console.log(event)
		this.setState({
			jobContent: text
		})
	}
	/**
	 * Set the state of the changed variable and then when set, call validator
	 *
	 * @param {Event} e
	 */
	// handleChange(e) {
	// 	var state = {};
	// 	state[e.target.name] = e.target.value;

	// 	this.setState(state, () => {
	// 		this.props.handleValidation(e.target.name)(e);
	// 	});
	// }

	render() {

		let {jobs} = this.props;
		let jobStatusCN = {
			'0': '请选择职位热度',
			'new': '热门',
			'normal': '普通'
		};
		function renderValidationState(messages) {
            if (messages.length) {

                return 'warning';
            }
        }
		return (
				<div>
					<Grid>
						
						<h1 className='page-header'>新增职位 </h1>
						<Row className="show-grid">
							<Col xs={12} md={6}>
								<form onSubmit={this.handleSubmitMe.bind(this)}>
									<FormGroup
											controlId="jobTitle" validationState={renderValidationState(this.props.getValidationMessages('jobTitle'))}
									>
										<ControlLabel>职位名称</ControlLabel>
										<FormControl
												type="text"
												ref="jobTitle"
												placeholder="请输入职位名称"
												onBlur={this.handleTitleBlur.bind(this)}
										/>
										<FormControl.Feedback />
										<HelpBlock>{this.props.getValidationMessages('jobTitle')} </HelpBlock>
									</FormGroup>
									<FormGroup controlId="jobTitleSlug" validationState={renderValidationState(this.props.getValidationMessages('jobTitleSlug'))}>
										<ControlLabel>职称拼音</ControlLabel>
										<FormControl
											type="text"
											placeholder="职称拼音"
											name="jobTitleSlug"
											ref='jobTitleSlug'
											onBlur={this.activateValidation}
										/>
										<FormControl.Feedback />
										<HelpBlock>{this.props.getValidationMessages('jobTitleSlug')}</HelpBlock>
									</FormGroup>
									<FormGroup controlId="jobStatus"  validationState={renderValidationState(this.props.getValidationMessages('jobStatus'))}>
										<ControlLabel>职位热度</ControlLabel>
										<FormControl componentClass="select" ref="jobStatus" placeholder="" onBlur={this.activateValidation}>
											<option value="">请选择职位热度...</option>
											<option value="new">热门</option>
											<option value="normal">普通</option>
										</FormControl>
										<FormControl.Feedback />
										<HelpBlock>{this.props.getValidationMessages('jobStatus')}</HelpBlock>
									</FormGroup>
									<FormGroup controlId="jobContent"  validationState={renderValidationState(this.props.getValidationMessages('jobContent'))}>
										<ControlLabel>职位内容</ControlLabel>
										<FormControl componentClass="textarea" placeholder="请输入职位内容" ref="jobContent" onBlur={this.activateValidation} onChange={this.handleContentChange.bind(this)}/>
										<HelpBlock>{this.props.getValidationMessages('jobContent')}</HelpBlock>
										<FormControl.Feedback />
									</FormGroup>

									<Editor value={this.state.jobContent} onChange={this.updateCode.bind(this)} />
									<Button type="submit" >
										&nbsp;&nbsp;提交&nbsp;&nbsp;
									</Button>
								</form>
							</Col>
							<Col xs={12} md={6}>
								<p>职位名称：{this.refs.jobTitle && findDOMNode(this.refs.jobTitle).value}</p>
                                <p>职位状态：{this.refs.jobStatus && jobStatusCN[findDOMNode(this.refs.jobStatus).value]}</p>
                                <br />
                                <h3>职位内容：</h3>
                                <hr />
                                <div dangerouslySetInnerHTML={{__html: this.state.jobContentHTML}} />
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

//将action的所有方法绑定到props上
function mapDispatchToProps (dispatch) {
	return bindActionCreators(JobsActions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)( validation(strategy)(AddPage) );
// export default validation(strategy)(connect(mapStateToProps)( AddPage) );
// export default validation(strategy)(connect(mapStateToProps)( AddPage) );