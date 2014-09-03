// Publish a single comment

Meteor.publish('singleComment', function(commentId) {
  if(canViewById(this.userId)){
    return Comments.find(commentId);
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
