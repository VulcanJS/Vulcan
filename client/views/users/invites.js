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
      if(result && result.newUser){
        throwError('Almost there. Please give your friend a sign up link to get in.');
      } else {
        throwError('Thank you!');
      }

      scrollUp();
    },

    onError: function(operation, error, template) {
      if(error && error.reason){
        throwError(error.reason);
        scrollUp();
      }
    }
  }
});