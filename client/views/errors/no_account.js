Template[getTemplate('no_account')].helpers({
  landingPageText: function(){
    return Settings.get("landingPageText");
  }
});
Template[getTemplate('no_account')].events({
  'click .twitter-button': function(){
    Meteor.loginWithTwitter(function(){
		Router.go('/');
    });
  }
});
