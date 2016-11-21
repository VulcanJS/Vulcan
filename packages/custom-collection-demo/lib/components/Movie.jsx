import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";
import Users from "meteor/nova:users";
import { Button } from 'react-bootstrap';
import { Accounts } from 'meteor/std:accounts-ui';
import { ModalTrigger } from "meteor/nova:core";
import Movies from '../collection.js';
import { withCurrentUser } from 'meteor/nova:core';

class Movie extends Component {

  renderEdit() {

    const movie = this.props;

    return (
      <div className="item-actions">
        <ModalTrigger 
        label="Edit Movie" 
        component={<Button bsStyle="primary">Edit Movie</Button>} 
        >
          <NovaForm 
            collection={Movies} 
            currentUser={this.props.currentUser} 
            document={movie} 
            mutationName="moviesEdit"
          />
        </ModalTrigger>
      </div>
    )
  }

  render() {
    
    const movie = this.props;

    return (
      <div key={movie.name} style={{paddingBottom: "15px",marginBottom: "15px", borderBottom: "1px solid #ccc"}}>
        <h2>{movie.name} ({movie.year})</h2>
        <p>{movie.review} – by <strong>{movie.user && movie.user.__displayName}</strong></p>
        {Movies.options.mutations.edit.check(this.props.currentUser, movie) ? this.renderEdit() : null}
      </div>
    )
  }

};

export default withCurrentUser(Movie);