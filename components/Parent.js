import React, { Component, PropTypes } from 'react';

export  default class Parent extends Component {
	static propTypes = {
		children: PropTypes.node
	}

	render() {
		return (
			<div>
				<h2>Parent</h2>
				{this.props.children}
			</div>
		);
	}
}
