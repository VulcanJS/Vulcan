import { createFragment } from 'apollo-client';
import gql from 'graphql-tag';
import Movies from '../collection.js';

// create fragments used to specify which information to query for
const moviesListProps = createFragment(gql`
  fragment moviesListProps on Movie {
    _id
    name
    createdAt
    year
    review
    privateComments
  }
`)

const moviesFullProps = createFragment(gql`
  fragment moviesFullProps on Movie {
    _id
    name
    createdAt
    year
    review
    privateComments
  }
`)

export { moviesListProps, moviesFullProps };