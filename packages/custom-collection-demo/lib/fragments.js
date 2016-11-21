import { createFragment } from 'apollo-client';
import gql from 'graphql-tag';

// create fragments used to specify which information to query for
const fragments = {
  moviesListFragment: createFragment(gql`
    fragment moviesListFragment on Movie {
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
  `),
  moviesSingleFragment: createFragment(gql`
    fragment moviesSingleFragment on Movie {
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
  `)
}

export default fragments;
