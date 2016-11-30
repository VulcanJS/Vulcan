/* 

List of movies. 
Wrapped with the "withList" and "withCurrentUser" containers.

*/

import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";
import { Button } from 'react-bootstrap';
import { ModalTrigger } from "meteor/nova:core";
import MoviesItem from './MoviesItem.jsx';
import Movies from '../collection.js';
import MoviesNewForm from './MoviesNewForm.jsx';
import { compose } from 'react-apollo';
import { withList } from 'meteor/nova:core';
import { withCurrentUser } from 'meteor/nova:core';

const LoadMore = props => <a href="#" className="load-more button button--primary" onClick={props.loadMore}>Load More ({props.count}/{props.totalCount})</a>

class MoviesList extends Component {

  renderNew() {
    
    const component = (
      <div className="add-movie">
        <ModalTrigger 
          title="Add Movie" 
          component={<Button bsStyle="primary">Add Movie</Button>}
        >
          <MoviesNewForm refetch={this.props.refetch}/>
        </ModalTrigger>
        <hr/>
      </div>
    )
    
    return !!this.props.currentUser ? component : null;
  }

  render() {

    const canCreateNewMovie = Movies.options.mutations.new.check(this.props.currentUser);
    
    if (this.props.loading) {
      return <Telescope.components.Loading />
    } else {
      const hasMore = this.props.totalCount > this.props.results.length;
      return (
        <div className="movies">
          {canCreateNewMovie ? this.renderNew() : null}
          {this.props.results.map(movie => <MoviesItem key={movie._id} {...movie} currentUser={this.props.currentUser} refetch={this.props.refetch} />)}
          {hasMore ? <LoadMore {...this.props}/> : <p>No more movies</p>}
        </div>
      )
    }
  }

};

const listOptions = {
  collection: Movies,
  queryName: 'moviesListQuery',
  fragmentName: MoviesItem.fragmentName,
  fragment: MoviesItem.fragment,
};

export default compose(withList(listOptions), withCurrentUser)(MoviesList);
