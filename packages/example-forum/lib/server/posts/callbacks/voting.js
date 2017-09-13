import Posts from '../../../modules/posts/index.js'
import Users from 'meteor/vulcan:users';
import { addCallback } from 'meteor/vulcan:core';
import { operateOnItem } from 'meteor/vulcan:voting';

/**
 * @summary Make users upvote their own new posts
 */
function PostsNewUpvoteOwnPost(post) {
  var postAuthor = Users.findOne(post.userId);
  return {...post, ...operateOnItem(Posts, post, postAuthor, 'upvote', false)};
}

addCallback('posts.new.sync', PostsNewUpvoteOwnPost);
