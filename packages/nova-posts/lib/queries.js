import Telescope from 'meteor/nova:lib';
import Posts from './collection.js';

Telescope.graphQL.addQuery(`
  posts(terms: Terms, offset: Int, limit: Int): [Post]
  postsViewTotal(terms: Terms): Int 
  post(_id: String): Post
`);

Posts.graphQLQueries = {
  list: `
    _id
    title
    url
    slug
    thumbnailUrl
    baseScore
    postedAt
    sticky
    categories {
      _id
      name
      slug
    }
    commentCount
    commenters {
      _id
      telescope {
        displayName
        emailHash
        slug
      }
    }
    upvoters {
      _id
    }
    downvoters {
      _id
    }
    upvotes # should be asked only for admins?
    score # should be asked only for admins?
    viewCount # should be asked only for admins?
    clickCount # should be asked only for admins?
    user {
      _id
      telescope {
        displayName
        slug
        emailHash
      }
    }
  `,
  single: `
    _id
    title
    url
    slug
    body
    htmlBody
    thumbnailUrl
    baseScore
    postedAt
    sticky
    status
    categories {
      _id
      name
      slug
    }
    commentCount
    commenters {
      _id
      telescope {
        slug
        emailHash
      }
    }
    upvoters {
      _id
    }
    downvoters {
      _id
    }
    upvotes # should be asked only for admins?
    score # should be asked only for admins?
    viewCount # should be asked only for admins?
    clickCount # should be asked only for admins?
    user {
      _id
      telescope {
        displayName
        slug
        emailHash
      }
    }
  `
};