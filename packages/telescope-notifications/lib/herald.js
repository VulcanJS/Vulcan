
// send emails every second when in dev environment
if (Meteor.absoluteUrl().indexOf('localhost') !== -1)
  Herald.settings.queueTimer = 1000;

Meteor.startup(function () {

  Herald.collection.deny({
    update: !can.editById,
    remove: !can.editById
  });

  // disable all email notifications when "emailNotifications" is set to false
  Herald.settings.overrides.email = !Settings.get('emailNotifications', true);

});

var commentEmail = function (userToNotify) {
  var notification = this;
  // put in setTimeout so it doesn't hold up the rest of the method
  Meteor.setTimeout(function () {
    notificationEmail = buildEmailNotification(notification);
    sendEmail(getEmail(userToNotify), notificationEmail.subject, notificationEmail.html);
  }, 1);
}

var getCommenterProfileUrl = function (comment) {
  var user = Meteor.users.findOne(comment.userId);
  if (user) {
    return getProfileUrl(user);
  } else {
    return getProfileUrlBySlugOrId(comment.userId);
  }
}

var getAuthor = function (comment) {
  var user = Meteor.users.findOne(comment.userId);
  if (user) {
    return getUserName(user);
  } else {
    return comment.author;
  }
}

// ------------------------------------------------------------------------------------------- //
// -----------------------------------------  Posts ------------------------------------------ //
// ------------------------------------------------------------------------------------------- //

Herald.addCourier('newPost', {
  media: {
    email: {
      emailRunner: function (user) {
        var p = getPostProperties(this.data);
        var subject = p.postAuthorName+' has created a new post: '+p.postTitle;
        var html = buildEmailTemplate(getEmailTemplate('emailNewPost')(p));
        sendEmail(getEmail(user), subject, html);
      }
    }
  }
  // message: function (user) { return 'email template?' }
});

Herald.addCourier('newPendingPost', {
  media: {
    email: {
      emailRunner: function (user) {
        var p = getPostProperties(this.data);
        var subject = p.postAuthorName+' has a new post pending approval: '+p.postTitle;
        var html = buildEmailTemplate(getEmailTemplate('emailNewPendingPost')(p));
        sendEmail(getEmail(user), subject, html);
      }
    }
  }
});

Herald.addCourier('postApproved', {
  media: {
    onsite: {},
    email: {
      emailRunner: function (user) {
        var p = getPostProperties(this.data);
        var subject = 'Your post “'+p.postTitle+'” has been approved';
        var html = buildEmailTemplate(getEmailTemplate('emailPostApproved')(p));
        sendEmail(getEmail(user), subject, html);
      }
    }
  },
  message: {
    default: function (user) {
      return Blaze.toHTML(Blaze.With(this, function () {
        return Template[getTemplate('notificationPostApproved')];
      }));
    }
  },
  transform: {
    postUrl: function () {
      var p = getPostProperties(this.data);
      return p.postUrl;
    },
    postTitle: function () {
      var p = getPostProperties(this.data);
      return p.postTitle;
    }
  }
});

// ------------------------------------------------------------------------------------------- //
// ---------------------------------------- Comments ----------------------------------------- //
// ------------------------------------------------------------------------------------------- //

// specify how to get properties used in template from comment data
var commentCourierTransform = {
  profileUrl: function () {
    return getCommenterProfileUrl(this.data.comment);
  },
  postCommentUrl: function () {
    return Router.path('post_page', {_id: this.data.post._id});
  },
  author: function () {
    return getAuthor(this.data.comment);
  },
  postTitle: function () {
    return this.data.post.title;
  },
  url: function () {
    return Router.path('comment_reply', {_id: this.parentComment._id});
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
    default: function (user) {
      return Blaze.toHTML(Blaze.With(this, function () {
        return Template[getTemplate('notificationNewComment')];
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
    default: function (user) {
      return Blaze.toHTML(Blaze.With(this, function () {
        return Template[getTemplate('notificationNewReply')];
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
    default: function (user) {
      return Blaze.toHTML(Blaze.With(this, function () {
        return Template[getTemplate('notificationNewReply')];
      }));
    }
  },
  transform: commentCourierTransform
});
