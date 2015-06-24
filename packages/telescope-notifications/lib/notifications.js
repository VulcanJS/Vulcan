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

// set up couriers
_.each(notifications, function (notification, notificationName) {

  var courier = {
    media: {
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
    courier.media.onsite = {};
    courier.message = function () {
      return Blaze.toHTML(Blaze.With(this.data, function () {
        return Template[notification.onsiteTemplate];
      }));
    };
  }
  Herald.addCourier(notificationName, courier);

});