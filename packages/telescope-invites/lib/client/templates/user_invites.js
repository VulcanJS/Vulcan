Template[getTemplate('userInvites')].created = function () {

  var user = this.data;
  var instance = this;

  instance.invites = new ReactiveVar({});

  Meteor.autorun(function () {
    coreSubscriptions.subscribe('invites', user._id);
    var invites = Invites.find({invitingUserId: user._id});
    instance.invites.set(invites);
  });
};

Template[getTemplate('userInvites')].helpers({
  canCurrentUserInvite: function () {
    var currentUser = Meteor.user();
    return currentUser && (currentUser.inviteCount > 0 && can.invite(currentUser));
  },
  invitesLeft: function () {
    var currentUser = Meteor.user();
    return currentUser ? currentUser.inviteCount : 0;
  },
  invitesSchema: function () {
    // expose schema for Invites (used by AutoForm)
    return InviteSchema;
  },
  invites: function () {
    return Template.instance().invites.get();
  }
});

var scrollUp = function(){
  Deps.afterFlush(function() {
    var element = $('.grid > .error');
    $('html, body').animate({scrollTop: element.offset().top});
  });
};

AutoForm.hooks({
  inviteForm: {
    onSuccess: function(operation, result, template) {
      Messages.clearSeen();

      if(result && result.newUser){
        Messages.flash('An invite has been sent out. Thank you!', "success");
      } else {
        Messages.flash('Thank you!', "info");
      }
      scrollUp();
    },

    onError: function(operation, error, template) {
      Messages.clearSeen();

      if(error && error.reason){
        Messages.flash(error.reason, "error");
        scrollUp();
      }
    }
  }
});
