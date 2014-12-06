Template[getTemplate('invites')].helpers({
  canCurrentUserInvite: function(){
    var currentUser = Meteor.user();
    return currentUser && (currentUser.inviteCount > 0 && canInvite(currentUser));
  },

  invitesLeft: function(){
    var currentUser = Meteor.user();
    return currentUser ? currentUser.inviteCount : 0;
  },

  invitesSchema: function() {
    // expose schema for Invites (used by AutoForm) 
    return InviteSchema;
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
      clearSeenMessages();

      if(result && result.newUser){
        flashMessage('An invite has been sent out. Thank you!', "success");
      } else {
        flashMessage('Thank you!', "info");
      }
      scrollUp();
    },

    onError: function(operation, error, template) {
      clearSeenMessages();
      
      if(error && error.reason){
        flashMessage(error.reason, "error");
        scrollUp();
      }
    }
  }
});
