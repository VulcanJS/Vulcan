Meteor.methods({
  comment: function(postId, parentCommentId, text){
    var user = Meteor.user();
    var post=Posts.findOne(postId);
    var postUser=Meteor.users.findOne(post.userId);
    var timeSinceLastComment=timeSinceLast(user, Comments);
    var cleanText= cleanUp(text);

    var properties={
        'commentAuthorId': user._id,
        'commentAuthorName': getDisplayName(user),
        'postId': postId,
    };

    // check that user can comment
    if (!user || !canPost(user))
      throw new Meteor.Error('You need to login or be invited to post new comments.');
    
    // check that user waits more than 15 seconds between comments
    if(!this.isSimulation && (timeSinceLastComment < 15))
      throw new Meteor.Error(704, 'Please wait '+(15-timeSinceLastComment)+' seconds before commenting again');

    var comment = {
        post: postId
      , body: cleanText
      , userId: user._id
      , submitted: new Date().getTime()
      , author: getDisplayName(user)
    };
    if(parentCommentId)
      comment.parent = parentCommentId;

    var newCommentId=Comments.insert(comment);

    Posts.update(postId, {$inc: {comments: 1}});

    Meteor.call('upvoteComment', newCommentId);

    properties['commentId']=newCommentId;

    if(!this.isSimulation){
      if(parentCommentId){
        // child comment
        var parentComment=Comments.find(parentCommentId);
        var parentUser=Meteor.users.find(parentComment.userId);

        properties['parentCommentId']=parentCommentId;
        properties['parentAuthorId']=parentComment.userId;
        properties['parentAuthorName']=getDisplayName(parentUser);

        notify('newReply', properties, parentUser, user);
        if(parentComment.userId!=post.userId){
          // if the original poster is different from the author of the parent comment, notify them too
          notify('newComment', properties, postUser, Meteor.user());
        }
      }else{
        // root comment
        notify('newComment', properties, postUser, Meteor.user());
      }
    }
    return properties;
  },
  removeComment: function(commentId){
    var comment=Comments.findOne(commentId);
    // decrement post comment count
    Posts.update(comment.post, {$inc: {comments: -1}});
    // note: should we also decrease user's comment karma ?
    Comments.remove(commentId);
  }
});
