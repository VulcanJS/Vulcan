import Telescope from 'meteor/nova:lib';
import Comments from './collection.js';

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
Comments.helpers({getPageUrl: function () {return Comments.getPageUrl(this);}});

///////////////////
// Other Helpers //
///////////////////

/**
 * @summary Get a comment author's name
 * @param {Object} comment
 */
Comments.getAuthorName = function (comment) {
  var user = Meteor.users.findOne(comment.userId);
  return user ? user.getDisplayName() : comment.author;
};
Comments.helpers({getAuthorName: function () {return Comments.getAuthorName(this);}});

