import NovaEmail from 'meteor/nova:email';
import Comments from './collection.js';

const getComment = (commentId) => {
  return typeof Comments.findOne(commentId) === "undefined" ? {comment: Comments.findOne()} : {comment: Comments.findOne(commentId)};
};

NovaEmail.addEmails({

  newComment: {
    template: "newComment",
    path: "/email/new-comment/:_id?",
    getProperties: Comments.getNotificationProperties,
    subject({authorName = "[authorName]", postTitle = "[postTitle]"}) {
      return authorName+' left a new comment on your post "' + postTitle + '"';
    },
    getTestObject: getComment
  },

  newReply: {
    template: "newReply",
    path: "/email/new-reply/:_id?",
    getProperties: Comments.getNotificationProperties,
    subject({authorName = "[authorName]", postTitle = "[postTitle]"}) {
      return authorName+' replied to your comment on "'+postTitle+'"';
    },
    getTestObject: getComment
  },

  newCommentSubscribed: {
    template: "newComment",
    path: "/email/new-comment-subscribed/:_id?",
    getProperties: Comments.getNotificationProperties,
    subject({authorName = "[authorName]", postTitle = "[postTitle]"}) {
      return authorName+' left a new comment on "' + postTitle + '"';
    },
    getTestObject: getComment
  }

});