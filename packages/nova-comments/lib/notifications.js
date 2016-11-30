import Comments from './collection.js';
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

Comments.getNotificationProperties = function (data) {
  const comment = data.comment;
  const commentAuthor = Users.findOne(comment.userId);
  const post = Posts.findOne(comment.postId);
  const properties = {
    profileUrl: commentAuthor && Users.getProfileUrl(commentAuthor, true),
    postUrl: Posts.getPageUrl(post, true),
    authorName : Comments.getAuthorName(comment),
    postTitle: post.title,
    htmlBody: comment.htmlBody,
    commentUrl: Comments.getPageUrl(comment, true)
  };
  return properties;
};