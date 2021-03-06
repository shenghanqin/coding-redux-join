import React, { Component, PropTypes } from 'react';
import { Route, Link } from 'react-router';

import { Provider, connect } from 'react-redux';



import * as JobsActions from '../actions/actions';

import { Nav, Navbar, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';


// TODO 这里可能确实state
// @connect((state) => ({}))
function mapStateToProps(state) {
  return {};
}

// function mapDispatchToProps(dispatch) {
//   return { actions: bindActionCreators(actionCreators, dispatch) };
// }

class App extends Component {
	// static propTypes = {
	// 	children: PropTypes.node
	// }

	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		event.preventDefault();
		const { dispatch } = this.props;
		dispatch(JobsActions.createJob('Abcde' + Math.random()));

	}

	render() {
		// Display is only used for rendering, its not a property of <Link>
		const links = [
			//{ pathname: '/', display: '/'},
			{ pathname: '#/jobs', display: '职位列表'},
			{ pathname: '#/add', display: '新增职位'},
			//{ pathname: '/parent', query: { foo: 'bar' }, display: '/parent?foo=bar'},
			//{ pathname: '/parent/child', query: { bar: 'baz' }, display: '/parent/child?bar=baz'},
			//{ pathname: '/parent/child/123', query: { baz: 'foo' }, display: '/parent/child/123?baz=foo'}
		].map((l, i) =>
			<NavItem eventKey={1} href={l.pathname}>{l.display}</NavItem>
		);

		return (
				<div>
					<Navbar>
						<Navbar.Header>
							<Navbar.Brand>
								<a href="#">React - 加入我们</a>
							</Navbar.Brand>
							<Navbar.Toggle />
						</Navbar.Header>
						<Navbar.Collapse>
							<Nav>
								{links}

							</Nav>
							<Nav pullRight>
								<NavDropdown eventKey={3} title="小溪里的作品" id="basic-nav-dropdown">
									<MenuItem eventKey={3.1} href="http://www.xiaoxili.com/">个人博客</MenuItem>
								</NavDropdown>
							</Nav>
						</Navbar.Collapse>
					</Navbar>
					{this.props.children}
				</div>
		);
	}
}


App.propTypes = {
		children: PropTypes.node
	}
export default connect(mapStateToProps)(App);