import Users from 'meteor/nova:users';
import { Utils, getSetting } from 'meteor/nova:core';

// note: leverage weak dependencies on packages
const Comments = Package['nova:comments'] ? Package['nova:comments'].default : null;
const Posts = Package['nova:posts'] ? Package['nova:posts'].default : null;

Users.getNotificationProperties = user => {
  const properties = {
    profileUrl: Users.getProfileUrl(user),
    displayName: Users.getDisplayName(user),
    siteTitle: getSetting('title'),
    siteUrl: Utils.getSiteUrl(),
  };
  
  return properties;
};

if (!!Posts) {
  
  Posts.getNotificationProperties = data => {
    const post = data.post;
    const postAuthor = Users.findOne(post.userId);
    const properties = {
      postAuthorName : Posts.getAuthorName(post),
      postTitle : Utils.cleanUp(post.title),
      profileUrl: Users.getProfileUrl(postAuthor, true),
      postUrl: Posts.getPageUrl(post, true),
      thumbnailUrl: post.thumbnailUrl,
      linkUrl: !!post.url ? Utils.getOutgoingUrl(post.url) : Posts.getPageUrl(post, true),
    };
    
    if(post.url)
    properties.url = post.url;
    
    if(post.htmlBody)
    properties.htmlBody = post.htmlBody;
    
    return properties;
  };
  
}

if (!!Comments) {

  Comments.getNotificationProperties = data => {
    const comment = data.comment;
    const commentAuthor = Users.findOne(comment.userId);
    const post = Posts.findOne(comment.postId);
    const properties = {
      profileUrl: commentAuthor && Users.getProfileUrl(commentAuthor, true),
      postUrl: Posts.getPageUrl(post, true),
      authorName : Comments.getAuthorName(comment),
      postTitle: post.title,
      htmlBody: comment.htmlBody,
      commentUrl: Comments.getPageUrl(comment, true),
    };
    
    return properties;
  };
  
}
