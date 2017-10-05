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

registerFragment(`
  fragment UserMoviesVotes on User {
    _id
    votes(collectionName: "Movies"){
      _id
      voteType
      collectionName
      power
      documentId
    }
  }
`);