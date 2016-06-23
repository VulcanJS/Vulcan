import Comments from './collection.js';

//////////////////
// Link Helpers //
//////////////////

/**
 * @summary Get URL of a comment page.
 * @param {Object} comment
 */
Comments.getPageUrl = function(comment, isAbsolute){
  var isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  return prefix + "foo" + "#"+comment._id;
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
  if (user) {
    return user.getDisplayName();
  } else {
    return comment.author;
  }
};
Comments.helpers({getAuthorName: function () {return Comments.getAuthorName(this);}});

