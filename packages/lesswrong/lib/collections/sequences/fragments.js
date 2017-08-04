import { registerFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment SequencePageFragment on Sequence {
    _id
    createdAt
    userId
    user {
      displayName
    }
    title
    description
    chapterIds
    chapters {
      _id
      createdAt
      title
      subtitle
      description
      number
      postIds
      posts {
        _id
        createdAt
        postedAt
        content
        url
        title
        slug
        htmlBody
        excerpt
        viewCount
        lastCommentedAt
        clickCount
        author
        userId
      }
    }
  }
`);
