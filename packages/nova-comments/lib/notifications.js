import Comments from './collection.js';
import Posts from "meteor/nova:posts";

Comments.getNotificationProperties = function (data) {
  const comment = data.comment;
  const commentAuthor = Meteor.users.findOne(comment.userId);
  const post = Posts.findOne(comment.postId);
  const properties = {
    profileUrl: commentAuthor && commentAuthor.getProfileUrl(true),
    postUrl: Posts.getPageUrl(post, true),
    authorName : Comments.getAuthorName(comment),
    postTitle: post.title,
    htmlBody: comment.htmlBody,
    commentUrl: Comments.getPageUrl(comment, true)
  };
  return properties;
};