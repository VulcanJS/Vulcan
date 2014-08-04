getUnsubscribeLink = function(user){
  return Meteor.absoluteUrl()+'unsubscribe/'+user.email_hash;
};

// given a notification, return the correct subject and html to send an email
buildEmailNotification = function (notification) {
  var subject, template;

  var p = notification.properties;
  
  switch(notification.event){
    case 'newReply':
      subject = 'Someone replied to your comment on "'+p.postTitle+'"';
      template = 'emailNewReply';
      break;

    case 'newComment':
      subject = 'A new comment on your post "'+p.postTitle+'"';
      template = 'emailNewComment';
      break; 

    default:
      break;
  }

  p = _.extend(p,{
    body: marked(p.body),
    profileUrl: getProfileUrlById(p.commentAuthorId),
    postCommentUrl: getPostCommentUrl(p.postId, p.commentId)
  });

  console.log(p)

  var notificationHtml = Handlebars.templates[getTemplate(template)](p);
  var html = buildEmailTemplate(notificationHtml);

  return {
    subject: subject,
    html: html
  }
}

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

