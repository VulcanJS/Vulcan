import Users from 'meteor/vulcan:users';
import VulcanEmail from 'meteor/vulcan:email';

// note: leverage weak dependencies on packages
const Comments = Package['vulcan:comments'] ? Package['vulcan:comments'].default : null;
const Posts = Package['vulcan:posts'] ? Package['vulcan:posts'].default : null;

const getTestUser = userId => typeof Users.findOne(userId) === "undefined" ? Users.findOne() : Users.findOne(userId);

VulcanEmail.addEmails({
  
  newUser: {
    template: "newUser",
    path: "/email/new-user/:_id?",
    getProperties: Users.getNotificationProperties,
    subject() {
      return "A new user has been created";
    },
    getTestObject: getTestUser,
  },

  accountApproved: {
    template: "accountApproved",
    path: "/email/account-approved/:_id?",
    getProperties: Users.getNotificationProperties,
    subject() {
      return "Your account has been approved.";
    },
    getTestObject: getTestUser,
  }

});

if (!!Posts) {
  
  const getTestPost = postId => typeof Posts.findOne(postId) === "undefined" ? {post: Posts.findOne()} : {post: Posts.findOne(postId)};
  
  VulcanEmail.addEmails({
    
    newPost: {
      template: "newPost",
      path: "/email/new-post/:_id?",
      getProperties: Posts.getNotificationProperties,
      subject({postAuthorName="[postAuthorName]", postTitle="[postTitle]"}) {
        return postAuthorName+' has created a new post: '+postTitle;
      },
      getTestObject: getTestPost,
    },
    
    newPendingPost: {
      template: "newPendingPost",
      path: "/email/new-pending-post/:_id?",
      getProperties: Posts.getNotificationProperties,
      subject({postAuthorName="[postAuthorName]", postTitle="[postTitle]"}) {
        return postAuthorName+' has a new post pending approval: '+postTitle;
      },
      getTestObject: getTestPost,
    },
    
    postApproved: {
      template: "postApproved",
      path: "/email/post-approved/:_id?",
      getProperties: Posts.getNotificationProperties,
      subject({postTitle="[postTitle]"}) {
        return 'Your post “'+postTitle+'” has been approved';
      },
      getTestObject: getTestPost,
    }
    
  });
  
}


if (!!Comments) {
    
  const getTestComment = commentId => typeof Comments.findOne(commentId) === "undefined" ? {comment: Comments.findOne()} : {comment: Comments.findOne(commentId)};

  VulcanEmail.addEmails({

    newComment: {
      template: "newComment",
      path: "/email/new-comment/:_id?",
      getProperties: Comments.getNotificationProperties,
      subject({authorName = "[authorName]", postTitle = "[postTitle]"}) {
        return authorName+' left a new comment on your post "' + postTitle + '"';
      },
      getTestObject: getTestComment,
    },

    newReply: {
      template: "newReply",
      path: "/email/new-reply/:_id?",
      getProperties: Comments.getNotificationProperties,
      subject({authorName = "[authorName]", postTitle = "[postTitle]"}) {
        return authorName+' replied to your comment on "'+postTitle+'"';
      },
      getTestObject: getTestComment,
    },

    newCommentSubscribed: {
      template: "newComment",
      path: "/email/new-comment-subscribed/:_id?",
      getProperties: Comments.getNotificationProperties,
      subject({authorName = "[authorName]", postTitle = "[postTitle]"}) {
        return authorName+' left a new comment on "' + postTitle + '"';
      },
      getTestObject: getTestComment,
    }

  });
  
}
