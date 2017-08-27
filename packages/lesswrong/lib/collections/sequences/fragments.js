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
    color
  }
`);

registerFragment(`
  fragment SequencesNavigationFragment on Sequence {
    _id
    createdAt
    title
    color
    chapters {
      _id
      title
      sequenceId
      posts {
        _id
        slug
        title
        lastVisitedAt
        excerpt
        baseScore
        score
        commentCount
        viewCount
        clickCount
        upvotes
        downvotes
      }
    }
  }
`);
