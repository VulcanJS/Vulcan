/* 

A component that shows a detailed view of a single movie. 
Wrapped with the "withDocument" container.

*/

import React, { PropTypes, Component } from 'react';
import Movies from '../modules/collection.js';
import { withDocument, registerComponent } from 'meteor/nova:core';

const MoviesDetails = props => {
  const movie = props.document;
  if (props.loading) {
    return <p>Loading…</p>
  } else {
    return (
      <div>
        <h2>{movie.name} ({movie.year})</h2>
        <p>Reviewed by <strong>{movie.user && movie.user.displayName}</strong> on {movie.createdAt}</p>
        <p>{movie.review}</p>
        {movie.privateComments ? <p><strong>PRIVATE</strong>: {movie.privateComments}</p>: null}
      </div>
    )
  }
}

const options = {
  collection: Movies,
  queryName: 'moviesSingleQuery',
  fragmentName: 'MoviesDetailsFragment',
};

registerComponent('MoviesDetails', MoviesDetails, withDocument(options));
