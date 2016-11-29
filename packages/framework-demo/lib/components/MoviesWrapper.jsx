/* 

Wrapper for the Movies components

*/

import React, { PropTypes, Component } from 'react';
import Accounts from './Accounts.jsx';
import MoviesList from './MoviesList.jsx';

class MoviesWrapper extends Component {
  render() {
    return (
      <div className="wrapper">

        <div className="header">
          <Accounts />
        </div>        
        
        <div className="main">
          <MoviesList />
        </div>

      </div>
    )
  }
}

export default MoviesWrapper;