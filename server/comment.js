Meteor.methods({
  comment: function(postId, parentCommentId, text){
    var user = Meteor.users.findOne(this.userId());

    var comment = {
        post: postId
      , body: text
      , userId: user._id
      , submitted: new Date().getTime()
      , author: getDisplayName(user)
    };
    if(parentCommentId)
      comment.parent = parentCommentId;

    var newCommentId=Comments.insert(comment);

    Posts.update(postId, {$inc: {comments: 1}});

    Meteor.call('upvoteComment', newCommentId);

    return newCommentId;
  }
});
