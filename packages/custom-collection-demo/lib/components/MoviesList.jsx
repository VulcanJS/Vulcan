/* 

List of movies. 
Wrapped with the "withList" and "withCurrentUser" containers.

*/

import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";
import { Button } from 'react-bootstrap';
import { Accounts } from 'meteor/std:accounts-ui';
import { ModalTrigger } from "meteor/nova:core";
import MoviesItem from './MoviesItem.jsx';
import Movies from '../collection.js';
import MoviesNewForm from './MoviesNewForm.jsx';
import { compose } from 'react-apollo';
import { withCurrentUser, withList } from 'meteor/nova:core';
import fragments from '../fragments.js';

const LoadMore = props => <a href="#" className="load-more button button--primary" onClick={props.loadMore}>Load More ({props.count}/{props.totalCount})</a>

class MoviesList extends Component {

  renderNew() {
    
    const component = (
      <div className="add-movie">
        <ModalTrigger 
          title="Add Movie" 
          component={<Button bsStyle="primary">Add Movie</Button>}
        >
          <MoviesNewForm currentUser={this.props.currentUser}/>
        </ModalTrigger>
        <hr/>
      </div>
    )
    
    return !!this.props.currentUser ? component : null;
  }

  render() {
    if (this.props.loading) {
      return <div className="movies"><p>Loading…</p></div>
    } else {
      const hasMore = this.props.totalCount > this.props.results.length;
      return (
        <div className="movies">
          {this.renderNew()}
          {this.props.results.map(movie => <MoviesItem key={movie._id} {...movie} currentUser={this.props.currentUser}/>)}
          {hasMore ? <LoadMore {...this.props}/> : <p>No more movies</p>}
        </div>
      )
    }
  }

};

const listOptions = {
  collection: Movies,
  queryName: 'moviesListQuery',
  fragmentName: fragments.list.name,
  fragment: fragments.list.fragment,
};

export default compose(withList(listOptions), withCurrentUser)(MoviesList);
