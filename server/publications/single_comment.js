// Publish a single comment

Meteor.publish('singleComment', function(commentId) {
  if(canViewById(this.userId)){
    // publish both current comment and child comments
    var commentIds = [commentId];
    var childCommentIds = _.pluck(Comments.find({parentCommentId: commentId}, {fields: {_id: 1}}).fetch(), '_id');
    commentIds = commentIds.concat(childCommentIds);
    return Comments.find({_id: {$in: commentIds}});
  }
  return [];
});

// Publish the post related to the current comment

Meteor.publish('commentPost', function(commentId) {
  if(canViewById(this.userId)){
    var comment = Comments.findOne(commentId);
    return Posts.find({_id: comment && comment.postId});
  }
  return [];
});

// Publish author of the current comment

Meteor.publish('commentUser', function(commentId) {
  if(canViewById(this.userId)){
    var comment = Comments.findOne(commentId);
    return Meteor.users.find({_id: comment && comment.userId}, {fields: privacyOptions});
  }
  return [];
});
