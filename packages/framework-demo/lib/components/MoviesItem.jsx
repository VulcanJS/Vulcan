/* 

An item in the movies list.
Wrapped with the "withCurrentUser" container.

*/

import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import { Components, registerComponent, ModalTrigger } from 'meteor/nova:core';
import Movies from '../modules/collection.js';

class MoviesItem extends Component {

  renderDetails() {

    const movie = this.props;

    return (
      <div style={{display: 'inline-block', marginRight: '5px'}}>
        <ModalTrigger 
          label="View Details" 
          component={<Button bsStyle="primary">Read Review</Button>} 
        >
          <Components.MoviesDetails documentId={movie._id}/>
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
          <Components.MoviesEditForm currentUser={this.props.currentUser} documentId={movie._id} refetch={this.props.refetch}/>
        </ModalTrigger>
      </div>
    )
  }

  render() {
    
    const movie = this.props;

    return (
      <div key={movie.name} style={{paddingBottom: "15px",marginBottom: "15px", borderBottom: "1px solid #ccc"}}>
        <h2>{movie.name} ({movie.year})</h2>
        <p>By <strong>{movie.user && movie.user.displayName}</strong></p>
        <div className="item-actions">
          {this.renderDetails()}
          {Movies.options.mutations.edit.check(this.props.currentUser, movie) ? this.renderEdit() : null}
        </div>
      </div>
    )
  }

}

registerComponent('MoviesItem', MoviesItem);
