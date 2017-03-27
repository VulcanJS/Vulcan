/* 

An item in the movies list.
Wrapped with the "withCurrentUser" container.

*/

import React, { PropTypes, Component } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

import Movies from '../../modules/movies/collection.js';
import MoviesEditForm from './MoviesEditForm.jsx';

const MoviesItem = ({movie, currentUser}) =>

  <div style={{paddingBottom: "15px",marginBottom: "15px", borderBottom: "1px solid #ccc"}}>

    {/* document properties */}
    
    <h4>{movie.name} ({movie.year})</h4>
    <p>{movie.review} – {movie.user && movie.user.displayName}</p>
    
    {/* edit document form */}

    {Movies.options.mutations.edit.check(currentUser, movie) ? 
      <Components.ModalTrigger label="Edit Movie">
        <MoviesEditForm currentUser={currentUser} documentId={movie._id} />
      </Components.ModalTrigger>
      : null
    }

  </div>

export default MoviesItem;