/* 

An item in the movies list.
Wrapped with the "withCurrentUser" container.

*/

import React, { PropTypes, Component } from 'react';
import { registerComponent, ModalTrigger } from 'meteor/nova:core';

import Movies from '../../modules/movies/collection.js';
import MoviesEditForm from './MoviesEditForm.jsx';

const MoviesItem = ({movie, currentUser}) =>

  <div key={movie._id} style={{paddingBottom: "15px",marginBottom: "15px", borderBottom: "1px solid #ccc"}}>

    {/* document properties */}
    
    <ul>
      <li><strong>User:</strong> {movie.user && movie.user.displayName}</li>
      <li><strong>Name:</strong> {movie.name}</li>
      <li><strong>Year:</strong> {movie.year}</li>
      <li><strong>Review:</strong> {movie.review}</li>
    </ul>
    
    {/* edit document form */}

    {Movies.options.mutations.edit.check(currentUser, movie) ? 
      <ModalTrigger label="Edit Movie">
        <MoviesEditForm currentUser={currentUser} documentId={movie._id} />
      </ModalTrigger>
      : null
    }

  </div>

export default MoviesItem;