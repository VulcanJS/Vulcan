
// send emails every second when in dev environment
if (Meteor.absoluteUrl().indexOf('localhost') !== -1)
  Herald.settings.queueTimer = 1000;

Meteor.startup(function () {

  Herald.collection.deny({
    update: !Users.can.editById,
    remove: !Users.can.editById
  });

  // disable all email notifications when "emailNotifications" is set to false
  Herald.settings.overrides.email = !Settings.get('emailNotifications', true);

});

var commentEmail = function (userToNotify) {
  var notification = this;
  // put in setTimeout so it doesn't hold up the rest of the method
  Meteor.setTimeout(function () {
    notificationEmail = buildEmailNotification(notification);
    Telescope.email.send(Users.getEmail(userToNotify), notificationEmail.subject, notificationEmail.html);
  }, 1);
};

// ------------------------------------------------------------------------------------------- //
// -----------------------------------------  Posts ------------------------------------------ //
// ------------------------------------------------------------------------------------------- //

Herald.addCourier('newPost', {
  media: {
    email: {
      emailRunner: function (user) {
        var p = Posts.getProperties(this.data);
        var subject = p.postAuthorName+' has created a new post: '+p.postTitle;
        var html = Telescope.email.buildTemplate(Telescope.email.getTemplate('emailNewPost')(p));
        Telescope.email.send(Users.getEmail(user), subject, html);
      }
    }
  }
  // message: function (user) { return 'email template?' }
});

Herald.addCourier('newPendingPost', {
  media: {
    email: {
      emailRunner: function (user) {
        var p = Posts.getProperties(this.data);
        var subject = p.postAuthorName+' has a new post pending approval: '+p.postTitle;
        var html = Telescope.email.buildTemplate(Telescope.email.getTemplate('emailNewPendingPost')(p));
        Telescope.email.send(Users.getEmail(user), subject, html);
      }
    }
  }
});

Herald.addCourier('postApproved', {
  media: {
    onsite: {},
    email: {
      emailRunner: function (user) {
        var p = Posts.getProperties(this.data);
        var subject = 'Your post “'+p.postTitle+'” has been approved';
        var html = Telescope.email.buildTemplate(Telescope.email.getTemplate('emailPostApproved')(p));
        Telescope.email.send(Users.getEmail(user), subject, html);
      }
    }
  },
  message: {
    default: function () {
      return Blaze.toHTML(Blaze.With(this, function () {
        return Template.notification_post_approved;
      }));
    }
  },
  transform: { // used for on-site notifications
    postUrl: function () {
      var p = Posts.getProperties(this.data);
      return p.postUrl;
    },
    postTitle: function () {
      var p = Posts.getProperties(this.data);
      return p.postTitle;
    }
  }
});

// ------------------------------------------------------------------------------------------- //
// ---------------------------------------- Comments ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

// specify how to get properties used in template from comment data, used for on-site notifications
var commentCourierTransform = {
  profileUrl: function () {
    var user = Meteor.users.findOne(this.data.comment.userId);
    return user && user.getProfileUrl();
  },
  authorName: function () {
    return Comments.getAuthorName(this.data.comment);
  },
  commentUrl: function () {
    return Posts.getPageUrl({_id: this.data.post._id});
  },
  postTitle: function () {
    return this.data.post.title;
  }
};

Herald.addCourier('newComment', {
  media: {
    onsite: {},
    email: {
      emailRunner: commentEmail
    }
  },
  message: {
    default: function () {
      return Blaze.toHTML(Blaze.With(this, function () {
        return Template.notification_new_comment;
      }));
    }
  },
  transform: commentCourierTransform
});

Herald.addCourier('newReply', {
  media: {
    onsite: {},
    email: {
      emailRunner: commentEmail
    }
  },
  message: {
    default: function () {
      return Blaze.toHTML(Blaze.With(this, function () {
        return Template.notification_new_reply;
      }));
    }
  },
  transform: commentCourierTransform
});

Herald.addCourier('newCommentSubscribed', {
  media: {
    onsite: {},
    email: {
      emailRunner: commentEmail
    }
  },
  message: {
    default: function () {
      return Blaze.toHTML(Blaze.With(this, function () {
        return Template.notification_new_reply;
      }));
    }
  },
  transform: commentCourierTransform
});
