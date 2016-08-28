import Telescope from 'meteor/nova:lib';
import Posts from './collection.js'
import Users from 'meteor/nova:users';

Posts.getNotificationProperties = function (data) {
  const post = data.post;
  const postAuthor = Meteor.users.findOne(post.userId);
  const properties = {
    postAuthorName : Posts.getAuthorName(post),
    postTitle : Telescope.utils.cleanUp(post.title),
    profileUrl: Users.getProfileUrl(postAuthor, true),
    postUrl: Posts.getPageUrl(post, true),
    thumbnailUrl: post.thumbnailUrl,
    linkUrl: !!post.url ? Telescope.utils.getOutgoingUrl(post.url) : Posts.getPageUrl(post, true)
  };

  if(post.url)
    properties.url = post.url;

  if(post.htmlBody)
    properties.htmlBody = post.htmlBody;

  return properties;
};