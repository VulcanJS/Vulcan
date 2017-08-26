import { registerFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment SequencesPageFragment on Sequence {
    _id
    createdAt
    userId
    user {
      ...UsersMinimumInfo
    }
    chapters {
      title
      postIds
    }
    title
    description
    gridImageId
    bannerImageId
  }
`);
