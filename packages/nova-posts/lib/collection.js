import schema from './schema.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';
// import views from './views.js';
import { createCollection } from 'meteor/nova:core';

/**
 * @summary The global namespace for Posts.
 * @namespace Posts
 */
const Posts = createCollection({

  collectionName: 'posts',

  typeName: 'Post',

  schema,

  resolvers,

  mutations,

});

// refacto: moved here from schema.js
Posts.config = {};

Posts.config.STATUS_PENDING = 1;
Posts.config.STATUS_APPROVED = 2;
Posts.config.STATUS_REJECTED = 3;
Posts.config.STATUS_SPAM = 4;
Posts.config.STATUS_DELETED = 5;

export default Posts;

// const PostsStub = {
//   helpers: x => x
// }

//  we need to handle two scenarios: when the package is called as a Meteor package, 
// and when it's called as a NPM package 
// const Posts = typeof Mongo !== 'undefined' ? new Mongo.Collection('posts') : PostsStub;