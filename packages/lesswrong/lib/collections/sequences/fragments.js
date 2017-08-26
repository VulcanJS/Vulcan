import { registerFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment SequencesPageFragment on Sequence {
    _id
    createdAt
    userId
    user {
      ...UsersMinimumInfo
    }
    title
    description
    gridImageId
    bannerImageId
  }
`);

registerFragment(`
  fragment SequencesNavigationFragment on Sequence {
    _id
    createdAt
    title
    chapters {
      title
      posts {
        _id
        slug
        title
        lastVisitedAt
        excerpt
      }
    }
  }
`);
