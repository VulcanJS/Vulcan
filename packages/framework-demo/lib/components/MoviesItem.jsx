/* 

An item in the movies list.
Wrapped with the "withCurrentUser" container.

*/

import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import { ModalTrigger } from 'meteor/nova:core';
import MoviesEditForm from './MoviesEditForm.jsx';
import MoviesDetails from './MoviesDetails.jsx';
import { withCurrentUser } from 'meteor/nova:core';
import Movies from '../collection.js';
import gql from 'graphql-tag';

class MoviesItem extends Component {

  renderDetails() {

    const movie = this.props;

    return (
      <div style={{display: 'inline-block', marginRight: '5px'}}>
        <ModalTrigger 
          label="View Details" 
          component={<Button bsStyle="primary">Read Review</Button>} 
        >
          <MoviesDetails documentId={movie._id}/>
        </ModalTrigger>
      </div>
    )

  }

  renderEdit() {

    const movie = this.props;

    return (
      <div style={{display: 'inline-block', marginRight: '5px'}}>
        <ModalTrigger 
          label="Edit Movie" 
          component={<Button bsStyle="primary">Edit Movie</Button>} 
        >
          <MoviesEditForm currentUser={this.props.currentUser} documentId={movie._id} refetch={this.props.refetch}/>
        </ModalTrigger>
      </div>
    )
  }

  render() {
    
    const movie = this.props;

    return (
      <div key={movie.name} style={{paddingBottom: "15px",marginBottom: "15px", borderBottom: "1px solid #ccc"}}>
        <h2>{movie.name} ({movie.year})</h2>
        <p>By <strong>{movie.user && movie.user.__displayName}</strong></p>
        <div className="item-actions">
          {this.renderDetails()}
          {Movies.options.mutations.edit.check(this.props.currentUser, movie) ? this.renderEdit() : null}
        </div>
      </div>
    )
  }

};

MoviesItem.fragmentName = 'moviesItemFragment';
MoviesItem.fragment = gql`
  fragment moviesItemFragment on Movie {
    _id
    name
    year
    user {
      __displayName
    }
  }
`;

export default withCurrentUser(MoviesItem);