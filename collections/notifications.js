Notifications = new Meteor.Collection('notifications');

Notifications.allow({
    insert: function(userId, doc){
      // new notifications can only be created via a Meteor method
      return false;
    }
  , update: canEditById
  , remove: canEditById
});

getNotification = function(event, properties, context){
  var notification = {};
  // the default context to display notifications is the notification sidebar
  var context = typeof context === 'undefined' ? 'sidebar' : context;
  var p = properties;
  switch(event){
    case 'newReply':
      notification.subject = i18n.t('Someone replied to your comment on')+' "'+p.postHeadline+'"';
      notification.text = p.commentAuthorName+i18n.t(' has replied to your comment on')+' "'+p.postHeadline+'": '+getPostCommentUrl(p.postId, p.commentId);
      notification.html = '<p><a href="'+getUserUrl(p.commentAuthorId)+'">'+p.commentAuthorName+'</a>'.i18n.t(' has replied to your comment on')+' "<a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">'+p.postHeadline+'</a>"</p>';
      if(context === 'email')
        notification.html += '<p>'+p.commentExcerpt+'</p><a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">'+i18n.t('Read more')+'</a>';
    break;

    case 'newComment':
      notification.subject = i18n.t('A new comment on your post')+' "'+p.postHeadline+'"';
      notification.text = i18n.t('You have a new comment by ')+p.commentAuthorName+i18n.t(' on your post')+' "'+p.postHeadline+'": '+getPostCommentUrl(p.postId, p.commentId);
      notification.html = '<p><a href="'+getUserUrl(p.commentAuthorId)+'">'+p.commentAuthorName+'</a> left a new comment on your post "<a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">'+p.postHeadline+'</a>"</p>';
      if(context === 'email')
        notification.html += '<p>'+p.commentExcerpt+'</p><a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">'+i18n.t('Read more')+'</a>';
    break;

    case 'newPost':
      notification.subject = p.postAuthorName+i18n.t(' has created a new post')+': "'+p.postHeadline+'"';
      notification.text = p.postAuthorName+i18n.t(' has created a new post')+': "'+p.postHeadline+'" '+getPostUrl(p.postId);
      notification.html = '<a href="'+getUserUrl(p.postAuthorId)+'">'+p.postAuthorName+'</a>'+i18n.t(' has created a new post')+': "<a href="'+getPostUrl(p.postId)+'" class="action-link">'+p.postHeadline+'</a>".';
    break;

    case 'accountApproved':
      notification.subject = i18n.t('Your account has been approved.');
      notification.text = i18n.t('Welcome to ')+getSetting('title')+'! '+i18n.t('Your account has just been approved.');
      notification.html = i18n.t('Welcome to ')+getSetting('title')+'!<br/> '+i18n.t('Your account has just been approved.')+' <a href="'+Meteor.absoluteUrl()+'">'+i18n.t('Start posting.')+'</a>';
    break;

    default:
    break;
  }
  return notification;
}

Meteor.methods({
  markAllNotificationsAsRead: function() {
    Notifications.update(
      {userId: Meteor.userId()},
      {
        $set:{
          read: true
        }
      },
      {multi: true}
    );
  }
});