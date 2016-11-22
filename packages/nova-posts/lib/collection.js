import Telescope from 'meteor/nova:lib';
import schema, { config, formGroups } from './schema.js';
import fragments from './fragments.js';
import mutations from './mutations.js';
import resolvers from './resolvers.js';

/**
 * @summary The global namespace for Posts.
 * @namespace Posts
 */
const Posts = Telescope.createCollection({

  collectionName: 'posts',

  typeName: 'Post',

  schema,

  fragments,

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