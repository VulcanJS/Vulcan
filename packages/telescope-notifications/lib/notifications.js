// --  OPTIONAL  --
//Insure that notification security is maintained as per telescope standards.
Notifications.collection.deny({
  update: ! can.editById,
  remove: ! can.editById
});

Notifications.addEventType('newReply', {
  message: function () {
    return this.properties.comment.author + " has replied to your comment on \"" + this.properties.post.title + "\"";
  },
  metadata: {
    emailTemplate: 'emailNewReply',
    template: 'notificationNewReply'
  },
  media: ['onsite']
});

Notifications.addEventType('newComment', {
  message: function () {
    return this.properties.comment.author + " left a new comment on \"" + this.properties.post.title + "\"";
  },
  metadata: {
    emailTemplate: 'emailNewComment',
    template: 'notificationNewComment'
  },
  media: ['onsite']
});

_createNotification = function(event, params, userToNotify) {
  params = {
    event: event,
    properties: params
  };
  // 1. Store notification in database
   Notifications.createNotification(userToNotify._id, params, function (error, notificationId) { 
    if (error) throw error; //output error like normal
    // 2. Send notification by email (if on server)
    if(Meteor.isServer && getUserSetting('notifications.replies', false, userToNotify)){
      var notification = Notifications.collection.findOne(notificationId);
      // put in setTimeout so it doesn't hold up the rest of the method
      Meteor.setTimeout(function () {
        notificationEmail = buildEmailNotification(notification);
        sendEmail(getEmail(userToNotify), notificationEmail.subject, notificationEmail.html);
      }, 1);
    }
  })
};

buildSiteNotification = function (notification) {
  var event = notification.event,
      comment = notification.properties.comment,
      post = notification.properties.post,
      userToNotify = Meteor.users.findOne(notification.userId),
      html;

  var properties = {
    profileUrl: getProfileUrlById(comment.userId),
    author: comment.author,
    postCommentUrl: getPostCommentUrl(post._id, comment._id),
    postTitle: post.title
  };

  html = Blaze.toHTML(Blaze.With(properties, function(){
    return Template[getTemplate(notification.metadata.template)]
  }));

  return html;
};

// add new post notification callback on post submit
postAfterSubmitMethodCallbacks.push(function (post) {
  if(Meteor.isServer && !!getSetting('emailNotifications', false)){
    // we don't want emails to hold up the post submission, so we make the whole thing async with setTimeout
    Meteor.setTimeout(function () {
      newPostNotification(post, [post.userId])
    }, 1);
  }
  return post;
});

// add new comment notification callback on comment submit
commentAfterSubmitMethodCallbacks.push(function (comment) {
  if(Meteor.isServer){

    var parentCommentId = comment.parentCommentId;
    var user = Meteor.user();
    var post = Posts.findOne(comment.postId);
    var postUser = Meteor.users.findOne(post.userId);

    var notificationProperties = {
      comment: _.pick(comment, '_id', 'userId', 'author', 'body'),
      post: _.pick(post, '_id', 'title', 'url')
    };

    if(parentCommentId){
      // child comment
      var parentComment = Comments.findOne(parentCommentId);
      var parentUser = Meteor.users.findOne(parentComment.userId);

      notificationProperties.parentComment = _.pick(parentComment, '_id', 'userId', 'author');

      // reply notification
      // do not notify users of their own actions (i.e. they're replying to themselves)
      if(parentUser._id != user._id)
        _createNotification('newReply', notificationProperties, parentUser);

      // comment notification
      // if the original poster is different from the author of the parent comment, notify them too
      if(postUser._id != user._id && parentComment.userId != post.userId)
        _createNotification('newComment', notificationProperties, postUser);

    }else{
      // root comment
      // don't notify users of their own comments
      if(postUser._id != user._id)
        _createNotification('newComment', notificationProperties, postUser);
    }
  }

  return comment;
});
