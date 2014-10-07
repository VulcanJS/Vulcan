Herald.collection.deny({
  update: ! can.editById,
  remove: ! can.editById
});

Meteor.startup(function () {
  // disable all email notifications when "emailNotifications" is set to false
  if (getSetting('emailNotifications', true)) {
    Herald.settings.overrides.email = false;
  } else {
    Herald.settings.overrides.email = true;
  };
});

var commentEmail = function (userToNotify) {
  var notification = this;
  // put in setTimeout so it doesn't hold up the rest of the method
  Meteor.setTimeout(function () {
    notificationEmail = buildEmailNotification(notification);
    sendEmail(getEmail(userToNotify), notificationEmail.subject, notificationEmail.html);
  }, 1);
}

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

Herald.addCourier('newComment', {
  media: {
    onsite: {},
    email: {
      emailRunner: commentEmail
    }
  },
  message: {
    default: function (user) {
       return Blaze.toHTML(Blaze.With(this, function(){
        return Template[getTemplate('notificationNewComment')]
      }));
    }
  },
  transform: {
    profileUrl: function () {
      var user = Meteor.users.findOne(this.data.comment.userId);
      if(user)
        return getProfileUrl(user);
    },
    postCommentUrl: function () {
      return '/posts/'+ this.data.post._id;
    },
    author: function () {
      var user = Meteor.users.findOne(this.data.comment.userId);
      if(user)
        return getUserName(user);
    },
    postTitle: function () {
      return this.data.post.title;
    },
    url: function () {
      return /comments/ + this.comment._id;
    }
  }
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
      return Blaze.toHTML(Blaze.With(this, function(){
        return Template[getTemplate('notificationNewReply')]
      }));
    }
  },
  transform: {
    profileUrl: function () {
      var user = Meteor.users.findOne(this.data.comment.userId);
      if(user)
        return getProfileUrl(user);
    },
    postCommentUrl: function () {
      return '/posts/'+ this.data.post._id;
    },
    author: function () {
      var user = Meteor.users.findOne(this.data.comment.userId);
      if(user)
        return getUserName(user);
    },
    postTitle: function () {
      return this.data.post.title;
    },
    url: function () {
      return /comments/ + this.parentComment._id;
    }
  }
});
