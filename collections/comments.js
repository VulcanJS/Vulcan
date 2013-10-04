Comments = new Meteor.Collection('comments');

Comments.allow({
    insert: canCommentById
  , update: canEditById
  , remove: canEditById
});

Comments.deny({
  update: function(userId, post, fieldNames) {
    if(isAdminById(userId))
      return false;
    // may only edit the following fields:
    return (_.without(fieldNames, 'text').length > 0);
  }
});

Meteor.methods({
  comment: function(postId, parentCommentId, text){
    var user = Meteor.user(),
        post=Posts.findOne(postId),
        postUser=Meteor.users.findOne(post.userId),
        timeSinceLastComment=timeSinceLast(user, Comments),
        cleanText= cleanUp(text),
        commentInterval = Math.abs(parseInt(getSetting('commentInterval',15))),
        properties={
          'commentAuthorId': user._id,
          'commentAuthorName': getDisplayName(user),
          'commentExcerpt': trimWords(stripMarkdown(cleanText),20),
          'postId': postId,
          'postHeadline' : post.headline
        };

    // check that user can comment
    if (!user || !canComment(user))
      throw new Meteor.Error('You need to login or be invited to post new comments.');
    
    // check that user waits more than 15 seconds between comments
    if(!this.isSimulation && (timeSinceLastComment < commentInterval))
      throw new Meteor.Error(704, 'Please wait '+(commentInterval-timeSinceLastComment)+' seconds before commenting again');

    // Don't allow empty comments
    if (!cleanText)
      throw new Meteor.Error(704,'Your comment is empty.');
          
    var comment = {
        post: postId,
        body: cleanText,
        userId: user._id,
        submitted: new Date().getTime(),
        author: getDisplayName(user)
    };
    
    if(parentCommentId)
      comment.parent = parentCommentId;

    var newCommentId=Comments.insert(comment);

    Posts.update(postId, {$inc: {comments: 1}});

    Meteor.call('upvoteComment', newCommentId);

    properties.commentId = newCommentId;

    if(!this.isSimulation){
      if(parentCommentId){
        // child comment
        var parentComment=Comments.findOne(parentCommentId);
        var parentUser=Meteor.users.findOne(parentComment.userId);

        properties.parentCommentId = parentCommentId;
        properties.parentAuthorId = parentComment.userId;
        properties.parentAuthorName = getDisplayName(parentUser);

        // do not notify users of their own actions (i.e. they're replying to themselves)
        if(parentUser._id != user._id)
          Meteor.call('createNotification','newReply', properties, parentUser, user);

        // if the original poster is different from the author of the parent comment, notify them too
        if(postUser._id != user._id && parentComment.userId != post.userId)
          Meteor.call('createNotification','newComment', properties, postUser, user);

      }else{
        // root comment
        // don't notify users of their own comments
        if(postUser._id != user._id)
          Meteor.call('createNotification','newComment', properties, postUser, Meteor.user());
      }
    }
    return properties;
  },
  removeComment: function(commentId){
    var comment=Comments.findOne(commentId);
    if(canEdit(Meteor.user(), comment)){
      // decrement post comment count
      Posts.update(comment.post, {$inc: {comments: -1}});
      // note: should we also decrease user's comment karma ?
      Comments.remove(commentId);
    }else{
      throwError("You don't have permission to delete this comment.");
    }
  }
});
