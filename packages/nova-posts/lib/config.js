/**
 * The global namespace/collection for Posts.
 * @namespace Posts
 */
Posts = new Mongo.Collection("posts");

/**
 * Posts config namespace
 * @type {Object}
 */
Posts.config = {};


/**
 * Post Statuses
 */
Posts.config.postStatuses = [
  {
    value: 1,
    label: function(){return __('pending');}
  },
  {
    value: 2,
    label: function(){return __('approved');}
  },
  {
    value: 3,
    label: function(){return __('rejected');}
  },
  {
    value: 4,
    label: function(){return __('spam');}
  },
  {
    value: 5,
    label: function(){return __('deleted');}
  }
];

Posts.config.STATUS_PENDING = 1;
Posts.config.STATUS_APPROVED = 2;
Posts.config.STATUS_REJECTED = 3;
Posts.config.STATUS_SPAM = 4;
Posts.config.STATUS_DELETED = 5;