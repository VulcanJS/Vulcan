import { createFragment } from 'apollo-client';
import gql from 'graphql-tag';

// create fragments used to specify which information to query for
const fragments = {

  list: {
    name: 'moviesListFragment',
    fragment: createFragment(gql`
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
  },

  single: {
    name: 'moviesSingleFragment',
    fragment: createFragment(gql`
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
  },
  
}

export default fragments;
