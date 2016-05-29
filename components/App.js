import React, { Component, PropTypes } from 'react';
import { Route, Link } from 'react-router';

import { Provider, connect } from 'react-redux';

import {
	push
} from 'redux-router';
class App extends Component {
	static propTypes = {
		children: PropTypes.node
	}

	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		event.preventDefault();
		const { dispatch } = this.props;

		dispatch(push({ pathname: '/parent/child/custom' }));
	}

	render() {
		// Display is only used for rendering, its not a property of <Link>
		const links = [
			{ pathname: '/', display: '/'},
			{ pathname: '/parent', query: { foo: 'bar' }, display: '/parent?foo=bar'},
			{ pathname: '/parent/child', query: { bar: 'baz' }, display: '/parent/child?bar=baz'},
			{ pathname: '/parent/child/123', query: { baz: 'foo' }, display: '/parent/child/123?baz=foo'}
		].map((l, i) =>
			<p key={i}>
				<Link to={l}>{l.display}</Link>
			</p>
		);

		return (
			<div>
				<h1>App Container</h1>
				{links}

				<a href="#" onClick={this.handleClick}>
					/parent/child/custom
				</a>
				{this.props.children}
			</div>
		);
	}
}


export default App;