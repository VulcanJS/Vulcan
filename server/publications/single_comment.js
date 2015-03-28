// Publish a single comment

Meteor.publish('singleCommentAndChildren', function(commentId) {
  if(can.viewById(this.userId)){
    // publish both current comment and child comments
    var commentIds = [commentId];
    var childCommentIds = _.pluck(Comments.find({parentCommentId: commentId}, {fields: {_id: 1}}).fetch(), '_id');
    commentIds = commentIds.concat(childCommentIds);
    return Comments.find({_id: {$in: commentIds}}, {sort: {score: -1, postedAt: -1}});
  }
  return [];
});

// Publish the post related to the current comment

Meteor.publish('commentPost', function(commentId) {
  if(can.viewById(this.userId)){
    var comment = Comments.findOne(commentId);
    return Posts.find({_id: comment && comment.postId});
  }
  return [];
});

// Publish author of the current comment, and author of the post related to the current comment

Meteor.publish('commentUsers', function(commentId) {
  
  var userIds = [];
  
  if(can.viewById(this.userId)){

    var comment = Comments.findOne(commentId);
    userIds.push(comment.userId);
    
    var post = Posts.findOne(comment.postId);
    userIds.push(post.userId);

    return Meteor.users.find({_id: {$in: userIds}}, {fields: privacyOptions});
    
  }

  return [];

});
