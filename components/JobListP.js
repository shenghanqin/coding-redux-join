import React, { Component, PropTypes } from 'react';

import { Provider, connect } from 'react-redux';

const mapStateToProps = (state) => {
	return {
		jobs: state.jobs
	}
};

class Joblist extends Component {
	static propTypes = {
		children: PropTypes.node
	}

	render() {
		let {jobs} = this.props;
		// Display is only used for rendering, its not a property of <Link>
		const links = jobs.map((job, i) =>
			<p key={i}>
				{job.title}
			</p>
		);
		return (
			<div>
				<h2>JobList</h2>
				{links}
			</div>
		);
	}
}


export default connect(mapStateToProps)(Joblist);