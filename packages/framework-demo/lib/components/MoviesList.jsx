/* 

List of movies. 
Wrapped with the "withList" and "withCurrentUser" containers.

*/

import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import gql from 'graphql-tag';
import Movies from '../collection.js';
import { Components, registerComponent, ModalTrigger, withList, withCurrentUser } from 'meteor/nova:core';

const LoadMore = props => <a href="#" className="load-more button button--primary" onClick={e => {e.preventDefault(); props.loadMore();}}>Load More ({props.count}/{props.totalCount})</a>

class MoviesList extends Component {

  renderNew() {
    
    const component = (
      <div className="add-movie">
        <ModalTrigger 
          title="Add Movie" 
          component={<Button bsStyle="primary">Add Movie</Button>}
        >
          <Components.MoviesNewForm />
        </ModalTrigger>
        <hr/>
      </div>
    )
    
    return !!this.props.currentUser ? component : null;
  }

  render() {

    const canCreateNewMovie = Movies.options.mutations.new.check(this.props.currentUser);
    
    if (this.props.loading) {
      return <Components.Loading />
    } else {
      const hasMore = this.props.totalCount > this.props.results.length;
      return (
        <div className="movies">
          {canCreateNewMovie ? this.renderNew() : null}
          {this.props.results.map(movie => <Components.MoviesItem key={movie._id} {...movie} currentUser={this.props.currentUser} refetch={this.props.refetch} />)}
          {hasMore ? <LoadMore {...this.props}/> : <p>No more movies</p>}
        </div>
      )
    }
  }

}

MoviesList.displayName = 'MoviesList';

export const MoviesListFragment = gql`
  fragment moviesItemFragment on Movie {
    _id
    name
    year
    createdAt
    user {
      displayName
    }
  }
`;

const listOptions = {
  collection: Movies,
  queryName: 'moviesListQuery',
  fragment: MoviesListFragment,
  limit: 5,
};

registerComponent('MoviesList', MoviesList, withList(listOptions), withCurrentUser);
