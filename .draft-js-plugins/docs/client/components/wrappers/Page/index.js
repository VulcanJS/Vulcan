import React, { Component } from 'react';

// import { Link, IndexLink } from 'react-router';
//
// <nav>
//   <IndexLink to="/" activeClassName={'wow'}>Home</IndexLink>
//   <Link to="/about" activeClassName={'that'}>About</Link>
// </nav>

export default class App extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
