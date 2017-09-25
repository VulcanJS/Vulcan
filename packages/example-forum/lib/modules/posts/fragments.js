import { registerFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment PostsList on Post {
    # posts
    _id
    title
    url
    slug
    postedAt
    createdAt
    sticky
    status
    excerpt
    viewCount
    clickCount
    # users
    userId
    user {
      ...UsersMinimumInfo
    }
    # embedly
    thumbnailUrl
    # categories
    categories {
      ...CategoriesMinimumInfo
    }
    # comments
    commentCount
    commenters {
      ...UsersMinimumInfo
    }
    # voting
    currentUserVotes{
      ...VoteFragment
    }
    baseScore
    score
  }
`);

registerFragment(`
  fragment PostsPage on Post {
    ...PostsList
    body
    htmlBody
  }
`);

