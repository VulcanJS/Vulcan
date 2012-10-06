Meteor.methods({
  comment: function(postId, parentCommentId, text){
    var user = Meteor.user();

    if (!user || !canPost(user))
      throw new Meteor.Error('You need to login or be invited to post new comments.')
    
    if(!this.isSimulation)
        limitRate(user, Comments, 15);

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
  },
  removeComment: function(commentId){
    var comment=Comments.findOne(commentId);
    // decrement post comment count
    Posts.update(comment.post, {$inc: {comments: -1}});
    // note: should we also decrease user's comment karma ?
    Comments.remove(commentId);
  }
});
