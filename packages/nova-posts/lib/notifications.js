import Posts from './collection.js'
import Users from 'meteor/nova:users';
import { Utils } from 'meteor/nova:core';

Posts.getNotificationProperties = function (data) {
  const post = data.post;
  const postAuthor = Users.findOne(post.userId);
  const properties = {
    postAuthorName : Posts.getAuthorName(post),
    postTitle : Utils.cleanUp(post.title),
    profileUrl: Users.getProfileUrl(postAuthor, true),
    postUrl: Posts.getPageUrl(post, true),
    thumbnailUrl: post.thumbnailUrl,
    linkUrl: !!post.url ? Utils.getOutgoingUrl(post.url) : Posts.getPageUrl(post, true)
  };

  if(post.url)
    properties.url = post.url;

  if(post.htmlBody)
    properties.htmlBody = post.htmlBody;

  return properties;
};