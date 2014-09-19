getUnsubscribeLink = function(user){
  return Meteor.absoluteUrl()+'unsubscribe/'+user.email_hash;
};

// given a notification, return the correct subject and html to send an email
buildEmailNotification = function (notification) {
  
  var subject, template;
  var post = notification.properties.post;
  var comment = notification.properties.comment;
  
  switch(notification.event){
    case 'newReply':
      subject = 'Someone replied to your comment on "'+post.title+'"';
      template = 'emailNewReply';
      break;

    case 'newComment':
      subject = 'A new comment on your post "'+post.title+'"';
      template = 'emailNewComment';
      break; 

    default:
      break;
  }

  var emailProperties = _.extend(notification.properties, {
    body: marked(comment.body),
    profileUrl: getProfileUrlById(comment.userId),
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

newPostNotification = function(post, excludedIDs){
  var excludedIDs = typeof excludedIDs == 'undefined' ? [] : excludedIDs;
  var p = getPostProperties(post);
  var subject = p.postAuthorName+' has created a new post: '+p.postTitle;
  var html = buildEmailTemplate(getEmailTemplate('emailNewPost')(p));

  // send a notification to every user according to their notifications settings
  Meteor.users.find({'profile.notifications.posts': 1}).forEach(function(user) {
    // don't send user a notification if their ID is in excludedIDs
    if(excludedIDs.indexOf(user._id) == -1)
      sendEmail(getEmail(user), subject, html);
  });
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

