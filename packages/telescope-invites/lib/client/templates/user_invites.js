Template.user_invites.created = function () {

  var user = this.data;
  var instance = this;

  instance.invites = new ReactiveVar({});

  Meteor.autorun(function () {
    Telescope.subsManager.subscribe('invites', user._id);
    var invites = Invites.find({invitingUserId: user._id});
    instance.invites.set(invites);
  });
};

Template.user_invites.helpers({
  canCurrentUserInvite: function () {
    var currentUser = Meteor.user();
    return currentUser && (Users.is.admin(currentUser) || currentUser.telescope.inviteCount > 0 && Users.can.invite(currentUser));
  },
  invitesLeft: function () {
    var currentUser = Meteor.user();
    return (currentUser && !(Users.is.admin(currentUser))) ? (currentUser.telescope.inviteCount - currentUser.telescope.invitedCount) : 0
  },
  invitesSchema: function () {
    // expose schema for Invites (used by AutoForm)
    return Invites.simpleSchema();
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
    onSuccess: function(operation, result) {
      Messages.clearSeen();

      if(result && result.newUser){
        Messages.flash('An invite has been sent out. Thank you!', "success");
      } else {
        Messages.flash('Thank you!', "info");
      }
      scrollUp();
    },

    onError: function(operation, error) {
      Messages.clearSeen();

      if(error && error.reason){
        Messages.flash(error.reason, "error");
        scrollUp();
      }
    }
  }
});
