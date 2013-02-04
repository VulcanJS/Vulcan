getNotification = function(event, properties, context){
  var notification = {};
  // the default context to display notifications is the notification sidebar
  var context = typeof context === 'undefined' ? 'sidebar' : context;
  var p = properties;
  switch(event){
    case 'newReply':
      notification.subject = 'Someone replied to your comment on "'+p.postHeadline+'"';
      notification.text = p.commentAuthorName+' has replied to your comment on "'+p.postHeadline+'": '+getPostCommentUrl(p.postId, p.commentId);
      notification.html = '<p><a href="'+getUserUrl(p.commentAuthorId)+'">'+p.commentAuthorName+'</a> has replied to your comment on "<a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">'+p.postHeadline+'</a>"</p>';
      if(context === 'email')
        notification.html += '<p>'+p.commentExcerpt+'</p><a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">Read more</a>';
    break;

    case 'newComment':
      notification.subject = 'A new comment on your post "'+p.postHeadline+'"';
      notification.text = 'You have a new comment by '+p.commentAuthorName+' on your post "'+p.postHeadline+'": '+getPostCommentUrl(p.postId, p.commentId);
      notification.html = '<p><a href="'+getUserUrl(p.commentAuthorId)+'">'+p.commentAuthorName+'</a> left a new comment on your post "<a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">'+p.postHeadline+'</a>"</p>';
      if(context === 'email')
        notification.html += '<p>'+p.commentExcerpt+'</p><a href="'+getPostCommentUrl(p.postId, p.commentId)+'" class="action-link">Read more</a>';
    break;

    case 'newPost':
      notification.subject = p.postAuthorName+' has created a new post: "'+p.postHeadline+'"';
      notification.text = p.postAuthorName+' has created a new post: "'+p.postHeadline+'" '+getPostUrl(p.postId);
      notification.html = '<a href="'+getUserUrl(p.postAuthorId)+'">'+p.postAuthorName+'</a> has created a new post: "<a href="'+getPostUrl(p.postId)+'" class="action-link">'+p.postHeadline+'</a>".';      
    break;

    default:
    break;
  }
  return notification;
}