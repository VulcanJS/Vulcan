Template.no_account.helpers({
  landingPageText: function(){
    return getSetting("landingPageText");
  }
});
Template.no_account.events = {
  'click .twitter-button': function(){
    Meteor.loginWithTwitter(function(){
		Meteor.Router.to('/');
    });
  }
};