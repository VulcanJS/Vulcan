getUnsubscribeLink = function(user){
  return getRouteUrl('unsubscribe', {hash: user.email_hash});
};

// given a notification, return the correct subject and html to send an email
buildEmailNotification = function (notification) {

  var subject,
      template,
      post = notification.data.post,
      comment = notification.data.comment;

  switch(notification.courier){

    case 'newComment':
      subject = notification.author()+' left a new comment on your post "' + post.title + '"';
      template = 'emailNewComment';
      break;

    case 'newReply':
      subject = notification.author()+' replied to your comment on "'+post.title+'"';
      template = 'emailNewReply';
      break;

    case 'newCommentSubscribed':
      subject = notification.author()+' left a new comment on "' + post.title + '"';
      template = 'emailNewComment';
      break;

    default:
      break;
  }

  var emailProperties = _.extend(notification.data, {
    body: marked(comment.body),
    profileUrl: getProfileUrlBySlugOrId(comment.userId),
    postCommentUrl: getPostCommentUrl(post._id, comment._id),
    postLink: getPostLink(post)
  });

  // console.log(emailProperties)

  var notificationHtml = getEmailTemplate(template)(emailProperties);
  var html = buildEmailTemplate(notificationHtml);

  return {
    subject: subject,
    html: html
  }
};

Meteor.methods({
  unsubscribeUser : function(hash){
    // TO-DO: currently, if you have somebody's email you can unsubscribe them
    // A user-specific salt should be added to the hashing method to prevent this
    var user = Meteor.users.findOne({email_hash: hash});
    if(user){
      var update = Meteor.users.update(user._id, {
        $set: {
          'profile.notifications.users' : 0,
          'profile.notifications.posts' : 0,
          'profile.notifications.comments' : 0,
          'profile.notifications.replies' : 0
        }
      });
      return true;
    }
    return false;
  }
});

