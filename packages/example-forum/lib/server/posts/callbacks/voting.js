/*

Voting callbacks

*/

import { Posts } from '../../../modules/posts/index.js';
import Users from 'meteor/vulcan:users';
import { addCallback } from 'meteor/vulcan:core';
import { performVoteServer } from 'meteor/vulcan:voting';

/**
 * @summary Make users upvote their own new posts
 */
function PostsNewUpvoteOwnPost(post) {
  var postAuthor = Users.findOne(post.userId);
  return {...post, ...performVoteServer({ document: post, voteType: 'upvote', collection: Posts, user: postAuthor, updateDocument: true })};
}

addCallback('posts.new.after', PostsNewUpvoteOwnPost);
