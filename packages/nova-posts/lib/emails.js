import Posts from './collection.js';
import NovaEmail from 'meteor/nova:email';

const getPost = (postId) => {
  return typeof Posts.findOne(postId) === "undefined" ? {post: Posts.findOne()} : {post: Posts.findOne(postId)};
};

NovaEmail.addEmails({

  newPost: {
    template: "newPost",
    path: "/email/new-post/:_id?",
    getProperties: Posts.getNotificationProperties,
    subject({postAuthorName="[postAuthorName]", postTitle="[postTitle]"}) {
      return postAuthorName+' has created a new post: '+postTitle;
    },
    getTestObject: getPost
  },

  newPendingPost: {
    template: "newPendingPost",
    path: "/email/new-pending-post/:_id?",
    getProperties: Posts.getNotificationProperties,
    subject({postAuthorName="[postAuthorName]", postTitle="[postTitle]"}) {
      return postAuthorName+' has a new post pending approval: '+postTitle;
    },
    getTestObject: getPost
  },

  postApproved: {
    template: "postApproved",
    path: "/email/post-approved/:_id?",
    getProperties: Posts.getNotificationProperties,
    subject({postTitle="[postTitle]"}) {
      return 'Your post “'+postTitle+'” has been approved';
    },
    getTestObject: getPost
  }

});