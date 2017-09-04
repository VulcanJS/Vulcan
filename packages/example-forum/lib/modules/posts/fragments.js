import { registerFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment PostsList on Post {
    # vulcan:posts
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
    # vulcan:users
    userId
    user {
      ...UsersMinimumInfo
    }
    # vulcan:embedly
    # thumbnailUrl
    # vulcan:categories
    categories {
      ...CategoriesMinimumInfo
    }
    # vulcan:comments
    commentCount
    commenters {
      ...UsersMinimumInfo
    }
    # vulcan:voting
    #upvoters {
    #  _id
    #}
    #downvoters {
    #  _id
    #}
    #upvotes
    #downvotes
    #baseScore
    #score
  }
`);

registerFragment(`
  fragment PostsPage on Post {
    ...PostsList
    body
    htmlBody
  }
`);

