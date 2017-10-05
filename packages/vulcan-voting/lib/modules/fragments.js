import { registerFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment VoteFragment on Vote {
    _id
    voteType
    power
  }
`);