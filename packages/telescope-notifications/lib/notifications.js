var notifications = {

  newPost: {
    properties: function () {
      return Posts.getNotificationProperties(this.data.post);
    },
    subject: function () {
      return this.postAuthorName+' has created a new post: '+this.postTitle;
    },
    emailTemplate: "emailNewPost"
  },

  newPendingPost: {
    properties: function () {
      return Posts.getNotificationProperties(this.data.post);
    },
    subject: function () {
      return this.postAuthorName+' has a new post pending approval: '+this.postTitle;
    },
    emailTemplate: "emailNewPendingPost"
  },

  postApproved: {
    properties: function () {
      return Posts.getNotificationProperties(this.data.post);
    },
    subject: function () {
      return this.postAuthorName+' has a new post pending approval: '+this.postTitle;
    },
    emailTemplate: "emailPostApproved",
    onsiteTemplate: "notification_post_approved"
  },

  newComment: {
    properties: function () {
      return Comments.getNotificationProperties(this.data.comment, this.data.post);
    },
    subject: function () {
      return this.authorName+' left a new comment on your post "' + this.postTitle + '"';
    },
    emailTemplate: "emailNewComment",
    onsiteTemplate: "notification_new_comment"
  },

  newReply: {
    properties: function () {
      return Comments.getNotificationProperties(this.data.comment, this.data.post);
    },
    subject: function () {
      return this.authorName+' replied to your comment on "'+this.postTitle+'"';
    },
    emailTemplate: "emailNewReply",
    onsiteTemplate: "notification_new_reply"
  },

  newCommentSubscribed: {
    properties: function () {
      return Comments.getNotificationProperties(this.data.comment, this.data.post);
    },
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
          var properties = notification.properties.call(this);
          var subject = notification.subject.call(properties);
          var html = Telescope.email.buildTemplate(Telescope.email.getTemplate(notification.emailTemplate)(properties));
          Telescope.email.send(Users.getEmail(user), subject, html);
        }
      }
    }
  };

  if (!!notification.onsiteTemplate) {
    courier.media.onsite = {};
    courier.message = function () {
      var properties = notification.properties.call(this);
      return Blaze.toHTML(Blaze.With(properties, function () {
        return Template[notification.onsiteTemplate];
      }));
    };
  }

  Herald.addCourier(notificationName, courier);

});