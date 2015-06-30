//////////////////////////////////////////////////////
// Collection Hooks                                 //
//////////////////////////////////////////////////////

Comments.before.insert(function (userId, doc) {
  // note: only actually sanitizes on the server
  doc.htmlBody = Telescope.utils.sanitize(marked(doc.body));
});

Comments.before.update(function (userId, doc, fieldNames, modifier) {
  // if body is being modified, update htmlBody too
  if (Meteor.isServer && modifier.$set && modifier.$set.body) {
    modifier.$set = modifier.$set || {};
    modifier.$set.htmlBody = Telescope.utils.sanitize(marked(modifier.$set.body));
  }
});

/**
 * Disallow $rename
 */
Comments.before.update(function (userId, doc, fieldNames, modifier) {
  if (!!modifier.$rename) {
    throw new Meteor.Error("illegal $rename operator detected!");
  }
});

//////////////////////////////////////////////////////
// Callbacks                                        //
//////////////////////////////////////////////////////

function afterCommentOperations (comment) {

  var userId = comment.userId;

  // increment comment count
  Meteor.users.update({_id: userId}, {
    $inc:       {'telescope.commentCount': 1}
  });

  // update post
  Posts.update(comment.postId, {
    $inc:       {commentCount: 1},
    $set:       {lastCommentedAt: new Date()},
    $addToSet:  {commenters: userId}
  });

  return comment;
}
Telescope.callbacks.add("commentSubmitAsync", afterCommentOperations);

function upvoteOwnComment (comment) {

  var commentAuthor = Meteor.users.findOne(comment.userId);

  // upvote comment
  Telescope.upvoteItem(Comments, comment, commentAuthor);

  return comment;
}
Telescope.callbacks.add("commentSubmitAsync", upvoteOwnComment);