var notifications = {

  newPost: {
    subject: function () {
      return this.postAuthorName+' has created a new post: '+this.postTitle;
    },
    emailTemplate: "emailNewPost"
  },

  newPendingPost: {
    subject: function () {
      return this.postAuthorName+' has a new post pending approval: '+this.postTitle;
    },
    emailTemplate: "emailNewPendingPost"
  },

  postApproved: {
    subject: function () {
      return this.postAuthorName+' has a new post pending approval: '+this.postTitle;
    },
    emailTemplate: "emailPostApproved",
    onsiteTemplate: "notification_post_approved"
  },

  newComment: {
    subject: function () {
      return this.authorName+' left a new comment on your post "' + this.postTitle + '"';
    },
    emailTemplate: "emailNewComment",
    onsiteTemplate: "notification_new_comment"
  },

  newReply: {
    subject: function () {
      return this.authorName+' replied to your comment on "'+this.postTitle+'"';
    },
    emailTemplate: "emailNewReply",
    onsiteTemplate: "notification_new_reply"
  },

  newCommentSubscribed: {
    subject: function () {
      return this.authorName+' left a new comment on "' + this.postTitle + '"';
    },
    emailTemplate: "notification_new_comment",
    onsite: "notification_new_comment"
  }

};

_.each(notifications, function (notification, notificationName) {

  var courier = {
    media: {
      onsite: {},
      email: {
        emailRunner: function (user) {
          var notificationProperties = this.data;
          var html = Telescope.email.buildTemplate(Telescope.email.getTemplate(notification.emailTemplate)(notificationProperties));
          Telescope.email.send(Users.getEmail(user), _.bind(notification.subject, notificationProperties)(), html);
        }
      }
    }
  };

  if (!!notification.onsiteTemplate) {
    courier.message = {
      default: function () {
        return Blaze.toHTML(Blaze.With(this.data, function () {
          return Template[notification.onsiteTemplate];
        }));
      }
    };
  }

  Herald.addCourier(notificationName, courier);

});

// var commentHerald = {
//   media: {
//     onsite: {},
//     email: {
//       emailRunner: commentEmailRunner
//     }
//   },
//   message: {
//     default: defaultMessage
//   }
// };

// Herald.addCourier('newComment', commentHerald);

// var postEmailRunner = function (user) {
//   var p = Posts.getNotificationProperties(this.data);
//   var subject = p.postAuthorName+' has created a new post: '+p.postTitle;
//   var html = Telescope.email.buildTemplate(Telescope.email.getTemplate('emailNewPost')(p));
//   Telescope.email.send(Users.getEmail(user), subject, html);
// };

// var postHerald = {
//   media: {
//     email: {
//       emailRunner: function (user) {

//         var notification = this,
//             subject,
//             template,
//             properties = Posts.getNotificationProperties(this.data);

//         // change the template and subject based on the notification type
//         switch(notification.courier){
//           case 'newPost':
//             subject = properties.postAuthorName+' has created a new post: '+properties.postTitle;
//             template = 'emailNewPost';
//             break;
//           case 'newPendingPost':
//             subject = properties.postAuthorName+' has a new post pending approval: '+properties.postTitle;
//             template = 'emailNewPendingPost';
//             break;
//           case 'postApproved':
//             subject = 'Your post “'+properties.postTitle+'” has been approved';
//             template = 'emailPostApproved';
//             break;
//           default:
//             break;
//         }
//         var html = Telescope.email.buildTemplate(Telescope.email.getTemplate(template)(properties));
//         Telescope.email.send(Users.getEmail(user), subject, html);

//       }
//     }
//   },
//   message: {
//     default: function () {

//         var notification = this,
//             template,
//             properties = Posts.getNotificationProperties(this.data);

//         // change the template based on the notification type
//         switch(notification.courier){
//           case 'postApproved':
//             subject = 'Your post “'+properties.postTitle+'” has been approved';
//             template = 'notification_post_approved';
//             break;
//           default:
//             break;
//         }

//       return Blaze.toHTML(Blaze.With(this, function () {
//         return Template[template];
//       }));
//     }
//   }
// };


// Herald.addCourier('newPost', {
//   media: {
//     email: {
//       emailRunner: function (user) {
//         var p = Posts.getNotificationProperties(this.data);
//         var subject = p.postAuthorName+' has created a new post: '+p.postTitle;
//         var html = Telescope.email.buildTemplate(Telescope.email.getTemplate('emailNewPost')(p));
//         Telescope.email.send(Users.getEmail(user), subject, html);
//       }
//     }
//   }
//   // message: function (user) { return 'email template?' }
// });

// Herald.addCourier('newPendingPost', {
//   media: {
//     email: {
//       emailRunner: function (user) {
//         var p = Posts.getNotificationProperties(this.data);
//         var subject = p.postAuthorName+' has a new post pending approval: '+p.postTitle;
//         var html = Telescope.email.buildTemplate(Telescope.email.getTemplate('emailNewPendingPost')(p));
//         Telescope.email.send(Users.getEmail(user), subject, html);
//       }
//     }
//   }
// });

// Herald.addCourier('postApproved', {
//   media: {
//     onsite: {},
//     email: {
//       emailRunner: function (user) {
//         var p = Posts.getNotificationProperties(this.data);
//         var subject = 'Your post “'+p.postTitle+'” has been approved';
//         var html = Telescope.email.buildTemplate(Telescope.email.getTemplate('emailPostApproved')(p));
//         Telescope.email.send(Users.getEmail(user), subject, html);
//       }
//     }
//   },
//   message: {
//     default: function () {
//       return Blaze.toHTML(Blaze.With(this, function () {
//         return Template.notification_post_approved;
//       }));
//     }
//   }
// });

// // email runner for all comment-related notifications
// var commentEmailRunner = function (userToNotify) {

//   var notification = this,
//       post = notification.data.post,
//       comment = notification.data.comment,
//       template,
//       subject;

//   // change the template and subject based on the notification type
//   switch(notification.courier){
//     case 'newComment':
//       subject = notification.authorName()+' left a new comment on your post "' + post.title + '"';
//       template = 'emailNewComment';
//       break;
//     case 'newReply':
//       subject = notification.authorName()+' replied to your comment on "'+post.title+'"';
//       template = 'emailNewReply';
//       break;
//     case 'newCommentSubscribed':
//       subject = notification.authorName()+' left a new comment on "' + post.title + '"';
//       template = 'emailNewComment';
//       break;
//     default:
//       break;
//   }

//   // apply comment properties to comment notification template
//   var notificationHtml = Telescope.email.getTemplate(template)(Comments.getNotificationProperties(comment));

//   // wrap notification template with email wrapper to get the final HTML
//   notificationHtml = Telescope.email.buildTemplate(notificationHtml);

//   // send the email on the server using defer
//   if (Meteor.isServer) {
//     Meteor.defer(function () {
//       Telescope.email.send(Users.getEmail(userToNotify), subject, notificationHtml);
//     });
//   }

// };

// // on-site message for all comment-related notifications
// var defaultMessage = function () {

//   var notification = this,
//       template;
  
//   switch(notification.courier){
//     case 'newComment':
//       template = 'notification_new_comment';
//       break;
//     case 'newReply':
//       template = 'emailNewReply';
//       break;
//     case 'newCommentSubscribed':
//       template = 'notification_new_reply';
//       break;
//     default:
//       break;
//   }

//   return Blaze.toHTML(Blaze.With(this, function () {
//     return Template[template];
//   }));

// };

// var commentHerald = {
//   media: {
//     onsite: {},
//     email: {
//       emailRunner: commentEmailRunner
//     }
//   },
//   message: {
//     default: defaultMessage
//   }
// };

// Herald.addCourier('newComment', commentHerald);
// Herald.addCourier('newReply', commentHerald);
// Herald.addCourier('newCommentSubscribed', commentHerald);
