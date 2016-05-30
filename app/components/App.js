import React, { Component, PropTypes } from 'react';
import { Route, Link } from 'react-router';

import { Provider, connect } from 'react-redux';



import * as JobsActions from '../actions';

@connect((state) => ({}))
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
		console.log(typeof  dispatch, this.props);
		dispatch(JobsActions.createJob('Abcde' + Math.random()));

	}

	render() {
		// Display is only used for rendering, its not a property of <Link>
		const links = [
			//{ pathname: '/', display: '/'},
			{ pathname: '/jobs', display: '职位列表'},
			{ pathname: '/add', display: '新增职位'},
			//{ pathname: '/parent', query: { foo: 'bar' }, display: '/parent?foo=bar'},
			//{ pathname: '/parent/child', query: { bar: 'baz' }, display: '/parent/child?bar=baz'},
			//{ pathname: '/parent/child/123', query: { baz: 'foo' }, display: '/parent/child/123?baz=foo'}
		].map((l, i) =>
				<p key={i}>
					<Link to={l}>{l.display}</Link>
				</p>
		);

		return (
				<div>
					<h1>加入我们</h1>
					{links}
					{this.props.children}
				</div>
		);
	}
}

export default App;