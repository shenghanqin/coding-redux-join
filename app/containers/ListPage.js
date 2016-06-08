import React, { Component, PropTypes } from 'react';

import { Provider, connect } from 'react-redux';

import {Grid, Button, Glyphicon} from 'react-bootstrap';

import { getJobs, removeJob} from '../actions/actions'

const mapStateToProps = (state) => {
	return {
		jobs: state.jobs
	}
};

class Joblist extends Component {
	static propTypes = {
		children: PropTypes.node
	};

	constructor(props) {
		super(props);
		this.props.dispatch(getJobs());

		this.handleRomoveOne = this.handleRomoveOne.bind(this);


	}

	handleRomoveOne(i, event) {
		console.log(event.target);
		console.log(i);
		// var key = i.getAttribute('data-key');
		// if (!!key) {
			this.props.dispatch(removeJob(this.props.jobs[i].key));
		// }

		//console.log(event._dispatchListeners, event._dispatchIDs);
	}
	render() {
		let {jobs} = this.props;
		let statusCN = {
			'old': '',
			'new': '热门'
		};

		//getStatusCN
		// Display is only used for rendering, its not a property of <Link>
		const links = jobs.map((job, i) =>
			<li key={i}>

				<h3><Button data-key={job.key} onClick={this.handleRomoveOne.bind(this, i)}><Glyphicon glyph="remove" /></Button>{'  '}{job.jobTitle}</h3>

				<br/>
			</li>
		);
		return (
				<div>
					<Grid>
						<h1 className='page-header' onClick={this.handleClick}>职位列表</h1>
						<ul>
							{links}
						</ul>

					</Grid>

			</div>
		);
	}
}


export default connect(mapStateToProps)(Joblist);