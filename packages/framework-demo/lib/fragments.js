import { registerFragment } from 'meteor/nova:core';

registerFragment(`
  fragment MoviesItemFragment on Movie {
    _id
    name
    year
    createdAt
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
    user {
      displayName
    }
  }
`);