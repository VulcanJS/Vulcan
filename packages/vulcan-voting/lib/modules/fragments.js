import { registerFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment VoteFragment on Vote {
    _id
    voteType
    power
  }
`);

registerFragment(`
  fragment WithVotePost on Post {
    __typename
    _id
    currentUserVotes{
      _id
      voteType
      power
    }
    baseScore
    score
  }
`);

registerFragment(`
  fragment WithVoteComment on Comment {
    __typename
    _id
    currentUserVotes{
      _id
      voteType
      power
    }
    baseScore
    score
  }
`);
