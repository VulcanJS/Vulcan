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
       posts {
         title
         lastVisitedAt
         baseScore
       }
    }
    title
    description
    gridImageId
    bannerImageId
  }
`);
