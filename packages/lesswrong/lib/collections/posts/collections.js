import 'meteor/vulcan:core';
import Posts from 'meteor/vulcan:posts';
import './schema.js'

Posts.config.STATUS_DRAFT = 6;
Posts.statuses = [...Posts.statuses,
  {value: 6, label: 'draft'}];

export default Posts;
