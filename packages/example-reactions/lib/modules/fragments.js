import { registerFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment MovieFragment on Movie {
    _id
    createdAt
    userId
    user {
      displayName
    }
    name
    year
    review
    currentUserVotes{
      _id
      voteType
      power
    }
    baseScore
  }
`);