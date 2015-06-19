//////////////////////////
// Notification Helpers //
//////////////////////////

/**
 * Grab common comment properties (for notifications).
 * @param {Object} post
 */
Comments.getProperties = function (comment) {
  var commentAuthor = Meteor.users.findOne(comment.userId);
  var c = {
    profileUrl: commentAuthor && commentAuthor.getProfileUrl(true),
    postUrl: Posts.getPageUrl({_id: comment.postId}, true),
    authorName : comment.getAuthorName(true),
    postTitle: Posts.findOne(comment.postId).title,
    htmlBody: comment.htmlBody,
    commentUrl: Comments.getPageUrl(comment, true)
  };
  console.log(c)
  return c;
};

//////////////////
// Link Helpers //
//////////////////

/**
 * Get URL of a comment page.
 * @param {Object} comment
 */
Comments.getPageUrl = function(comment, isAbsolute){
  var isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  return prefix + Router.path("comment_page", comment);
};
Comments.helpers({getPageUrl: function () {return Comments.getPageUrl(this);}});

///////////////////
// Other Helpers //
///////////////////

/**
 * Get a comment author's name
 * @param {Object} comment
 */
Comments.getAuthorName = function (comment) {
  var user = Meteor.users.findOne(comment.userId);
  if (user) {
    return user.getUserName();
  } else {
    return comment.author;
  }
};
Comments.helpers({getAuthorName: function () {return Comments.getAuthorName(this);}});