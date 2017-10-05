/*

Post validation and rate limiting callbacks

*/

import { Posts } from '../../../modules/posts/index.js'
import Users from 'meteor/vulcan:users';
import { addCallback, getSetting, registerSetting } from 'meteor/vulcan:core';
import { createError } from 'apollo-errors';

registerSetting('forum.postInterval', 30, 'How long users should wait between each posts, in seconds');
registerSetting('forum.maxPostsPerDay', 5, 'Maximum number of posts a user can create in a day');

/**
 * @summary Rate limiting
 */
function PostsNewRateLimit (post, user) {

  if(!Users.isAdmin(user)){

    var timeSinceLastPost = Users.timeSinceLast(user, Posts),
      numberOfPostsInPast24Hours = Users.numberOfItemsInPast24Hours(user, Posts),
      postInterval = Math.abs(parseInt(getSetting('forum.postInterval', 30))),
      maxPostsPer24Hours = Math.abs(parseInt(getSetting('forum.maxPostsPerDay', 5)));

    // check that user waits more than X seconds between posts
    if(timeSinceLastPost < postInterval){
      const RateLimitError = createError('posts.rate_limit_error', {message: 'posts.rate_limit_error'});
      throw new RateLimitError({data: {break: true, value: postInterval-timeSinceLastPost}});
    }
    // check that the user doesn't post more than Y posts per day
    if(numberOfPostsInPast24Hours >= maxPostsPer24Hours){
      const RateLimitError = createError('posts.max_per_day', {message: 'posts.max_per_day'});
      throw new RateLimitError({data: {break: true, value: maxPostsPer24Hours}});
    }
  }

  return post;
}
addCallback('posts.new.validate', PostsNewRateLimit);

/**
 * @summary Check for duplicate links
 */
function PostsNewDuplicateLinksCheck (post, user) {
  if(!!post.url && Posts.checkForSameUrl(post.url)) {
    const DuplicateError = createError('posts.link_already_posted', {message: 'posts.link_already_posted'});
    throw new DuplicateError({data: {break: true, url: post.url}});
  }
  return post;
}
addCallback('posts.new.sync', PostsNewDuplicateLinksCheck);


/**
 * @summary Check for duplicate links
 */
function PostsEditDuplicateLinksCheck (modifier, post) {
  if(post.url !== modifier.$set.url && !!modifier.$set.url) {
    Posts.checkForSameUrl(modifier.$set.url);
  }
  return modifier;
}
addCallback('posts.edit.sync', PostsEditDuplicateLinksCheck);
