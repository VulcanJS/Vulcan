import Comments from './collection.js';
import Posts from 'meteor/vulcan:posts';
import Users from 'meteor/vulcan:users';

//////////////////
// Link Helpers //
//////////////////

/**
 * @summary Get URL of a comment page.
 * @param {Object} comment
 */
Comments.getPageUrl = function(comment, isAbsolute = false){
  const post = Posts.findOne(comment.postId);
  return `${Posts.getPageUrl(post, isAbsolute)}/#${comment._id}`;
};

///////////////////
// Other Helpers //
///////////////////

/**
 * @summary Get a comment author's name
 * @param {Object} comment
 */
Comments.getAuthorName = function (comment) {
  var user = Users.findOne(comment.userId);
  return user ? Users.getDisplayName(user) : comment.author;
};
