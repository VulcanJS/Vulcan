import schema from './schema.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';
// import views from './views.js';
import { createCollection } from 'meteor/vulcan:core';

/**
 * @summary The global namespace for Posts.
 * @namespace Posts
 */
const Posts = createCollection({

  collectionName: 'Posts',

  typeName: 'Post',

  schema,

  resolvers,

  mutations,

});

// refactor: moved here from schema.js
Posts.config = {};

Posts.config.STATUS_PENDING = 1;
Posts.config.STATUS_APPROVED = 2;
Posts.config.STATUS_REJECTED = 3;
Posts.config.STATUS_SPAM = 4;
Posts.config.STATUS_DELETED = 5;


/**
 * @summary Posts statuses
 * @type {Object}
 */
Posts.statuses = [
  {
    value: 1,
    label: 'pending'
  },
  {
    value: 2,
    label: 'approved'
  },
  {
    value: 3,
    label: 'rejected'
  },
  {
    value: 4,
    label: 'spam'
  },
  {
    value: 5,
    label: 'deleted'
  }
];

export default Posts;
