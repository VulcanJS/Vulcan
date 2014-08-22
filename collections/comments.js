Comments = new Meteor.Collection("comments", {
  schema: new SimpleSchema({
    _id: {
      type: String,
      optional: true
    },
    parentCommentId: {
      type: String,
      optional: true
    },
    createdAt: {
      type: Date,
      optional: true
    },
    postedAt: { // for now, comments are always created and posted at the same time
      type: Date,
      optional: true
    },
    body: {
      type: String,
    },
    baseScore: {
      type: Number,
      decimal: true,
      optional: true
    },
    score: {
      type: Number,
      decimal: true,
      optional: true
    },
    upvotes: {
      type: Number,
      optional: true
    },
    upvoters: {
      type: [String], // XXX
      optional: true
    },
    downvotes: {
      type: Number,
      optional: true
    },
    downvoters: {
      type: [String], // XXX
      optional: true
    },
    author: {
      type: String,
      optional: true
    },
    inactive: {
      type: Boolean,
      optional: true
    },
    postId: {
      type: String, // XXX
      optional: true
    },
    userId: {
      type: String, // XXX
      optional: true
    }
  })
});

Comments.deny({
  update: function(userId, post, fieldNames) {
    if(isAdminById(userId))
      return false;
    // deny the update if it contains something other than the following fields
    return (_.without(fieldNames, 'body').length > 0);
  }
});

Comments.allow({
  insert: canCommentById,
  update: canEditById,
  remove: canEditById
});




Meteor.methods({
  comment: function(postId, parentCommentId, text){
    var user = Meteor.user(),
        post=Posts.findOne(postId),
        postUser=Meteor.users.findOne(post.userId),
        timeSinceLastComment=timeSinceLast(user, Comments),
        cleanText= cleanUp(text),
        commentInterval = Math.abs(parseInt(getSetting('commentInterval',15))),
        now = new Date();

    // check that user can comment
    if (!user || !canComment(user))
      throw new Meteor.Error(i18n.t('You need to login or be invited to post new comments.'));
    
    // check that user waits more than 15 seconds between comments
    if(!this.isSimulation && (timeSinceLastComment < commentInterval))
      throw new Meteor.Error(704, i18n.t('Please wait ')+(commentInterval-timeSinceLastComment)+i18n.t(' seconds before commenting again'));

    // Don't allow empty comments
    if (!cleanText)
      throw new Meteor.Error(704,i18n.t('Your comment is empty.'));
          
    var comment = {
      postId: postId,
      body: cleanText,
      userId: user._id,
      createdAt: now,
      postedAt: now,
      upvotes: 0,
      downvotes: 0,
      baseScore: 0,
      score: 0,
      author: getDisplayName(user)
    };
    
    if(parentCommentId)
      comment.parentCommentId = parentCommentId;

    var newCommentId=Comments.insert(comment);

    // increment comment count
    Meteor.users.update({_id: user._id}, {$inc: {commentCount: 1}});

    // extend comment with newly created _id
    comment = _.extend(comment, {_id: newCommentId});

    Posts.update(postId, {
      $inc:       {commentsCount: 1},
      $set:       {lastCommentedAt: now},
      $addToSet:  {commenters: user._id}
    });

    Meteor.call('upvoteComment', comment);

    var notificationProperties = {
      comment: _.pick(comment, '_id', 'userId', 'author', 'body'),
      post: _.pick(post, '_id', 'title', 'url')
    }

    if(!this.isSimulation){
      if(parentCommentId){
        // child comment
        var parentComment=Comments.findOne(parentCommentId);
        var parentUser=Meteor.users.findOne(parentComment.userId);

        notificationProperties.parentComment = _.pick(parentComment, '_id', 'userId', 'author');

          // reply notification
          // do not notify users of their own actions (i.e. they're replying to themselves)
          if(parentUser._id != user._id)
            createNotification('newReply', notificationProperties, parentUser);

          // comment notification
          // if the original poster is different from the author of the parent comment, notify them too
          if(postUser._id != user._id && parentComment.userId != post.userId)
            createNotification('newComment', notificationProperties, postUser);

      }else{
          // root comment
          // don't notify users of their own comments
          if(postUser._id != user._id)
            createNotification('newComment', notificationProperties, postUser);
      }
    }
    return comment;
  },
  removeComment: function(commentId){
    var comment=Comments.findOne(commentId);
    if(canEdit(Meteor.user(), comment)){
      // decrement post comment count and remove user ID from post
      Posts.update(comment.postId, {
        $inc:   {commentsCount: -1},
        $pull:  {commenters: comment.userId}
      });

      // decrement user comment count
      Meteor.users.update({_id: comment.userId}, {$inc: {commentCount: -1}});

      // note: should we also decrease user's comment karma ?
      Comments.remove(commentId);
    }else{
      throwError("You don't have permission to delete this comment.");
    }
  }
});
