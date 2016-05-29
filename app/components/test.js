import React, { Component, PropTypes } from 'react';

export  default class Test extends Component {
	render() {
		const { params: { id }} = this.props;

		return (
			<div>
				<h2>Child</h2>
				{id && <p>{id}</p>}
			</div>
		);
	}
}
/**
 * Created by hanqin on 16/5/29.
 */
