/* 

Register the two GraphQL fragments used to query for data

*/

import { registerFragment } from 'meteor/nova:core';

registerFragment(`
  fragment MoviesItemFragment on Movie {
    _id
    name
    year
    createdAt
    userId
    user {
      displayName
    }
  }
`);

registerFragment(`
  fragment MoviesDetailsFragment on Movie {
    _id
    name
    createdAt
    year
    review
    privateComments
    userId
    user {
      displayName
    }
  }
`);