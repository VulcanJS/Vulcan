// import { Mongo } from './imports.js';

/**
 * @summary The global namespace/collection for Posts.
 * @namespace Posts
 */

const PostsStub = {
  helpers: x => x
}

/* we need to handle two scenarios: when the package is called as a Meteor package, 
and when it's called as a NPM package */
Posts = typeof Mongo !== "undefined" ? new Mongo.Collection("posts") : PostsStub;

/**
 * @summary Posts config namespace
 * @type {Object}
 */
Posts.config = {};

/**
 * @summary Post Statuses
 */
Posts.config.postStatuses = [
  {
    value: 1,
    label: __('pending')
  },
  {
    value: 2,
    label: __('approved')
  },
  {
    value: 3,
    label: __('rejected')
  },
  {
    value: 4,
    label: __('spam')
  },
  {
    value: 5,
    label: __('deleted')
  }
];

Posts.config.STATUS_PENDING = 1;
Posts.config.STATUS_APPROVED = 2;
Posts.config.STATUS_REJECTED = 3;
Posts.config.STATUS_SPAM = 4;
Posts.config.STATUS_DELETED = 5;