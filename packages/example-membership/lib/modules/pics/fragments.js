/* 

Register the GraphQL fragment used to query for data

*/

import { registerFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment PicsItemFragment on Pic {
    _id
    createdAt
    userId
    user {
      displayName
    }
    imageUrl
    body
  }
`);

registerFragment(`
  fragment PicsDetailsFragment on Pic {
    _id
    createdAt
    userId
    user {
      displayName
    }
    imageUrl
    body
  }
`);