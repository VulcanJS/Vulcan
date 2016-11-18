import { createFragment } from 'apollo-client';
import gql from 'graphql-tag';
import Movies from '../collection.js';

// create fragments used to specify which information to query for
const fullMovieInfo = createFragment(gql`
  fragment fullMovieInfo on Movie {
    _id
    name
    createdAt
    year
  }
`)

export { fullMovieInfo };