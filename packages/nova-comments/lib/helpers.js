// import Telescope from 'meteor/nova:lib';
import Comments from './collection.js';
import Posts from 'meteor/nova:posts';
import Users from 'meteor/nova:users';

Comments.helpers({getCollection: () => Comments});
Comments.helpers({getCollectionName: () => "comments"});

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
Comments.helpers({getPageUrl: function (isAbsolute) {return Comments.getPageUrl(this, isAbsolute);}});

///////////////////
// Other Helpers //
///////////////////

/**
 * @summary Get a comment author's name
 * @param {Object} comment
 */
Comments.getAuthorName = function (comment) {
  var user = Users.findOne(comment.userId);
  return user ? user.getDisplayName() : comment.author;
};
Comments.helpers({getAuthorName: function () {return Comments.getAuthorName(this);}});

