/* 

A component that shows a detailed view of a single movie. 
Wrapped with the "withSingle" container.

*/

import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import Movies from '../collection.js';
import { withSingle } from 'meteor/nova:core';
import { compose } from 'react-apollo';
import gql from 'graphql-tag';

const MoviesDetails = props => {
  const movie = props.document;
  if (props.loading) {
    return <p>Loading…</p>
  } else {
    return (
      <div>
        <h2>{movie.name} ({movie.year})</h2>
        <p>Reviewed by <strong>{movie.user && movie.user.__displayName}</strong> on {movie.createdAt}</p>
        <p>{movie.review}</p>
      </div>
    )
  }
}

MoviesDetails.fragmentName = 'moviesDetailsFragment';
MoviesDetails.fragment = gql`
  fragment moviesDetailsFragment on Movie {
    _id
    name
    createdAt
    year
    review
    privateComments
    user {
      __displayName
    }
  }
`;

const options = {
  collection: Movies,
  queryName: 'moviesSingleQuery',
  fragmentName: MoviesDetails.fragmentName,
  fragment: MoviesDetails.fragment,
};

export default compose(withSingle(options))(MoviesDetails);