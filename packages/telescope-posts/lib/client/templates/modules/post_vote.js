Template.post_vote.helpers({
  enableDownvotes: function () {
    return Settings.get("enableDownvotes", false);
  },
  actionsClass: function () {
    var user = Meteor.user();
    var actionsClass = "";
    if(!user) return false;
    if (user.hasUpvoted(this)) {
      actionsClass += " voted upvoted";
    }
    if (user.hasDownvoted(this)) {
      actionsClass += " voted downvoted";
    }
    if (Settings.get("enableDownvotes", false)) {
      actionsClass += " downvotes-enabled";
    }
    return actionsClass;
  }
});

Template.post_vote.events({
  'click .upvote-link': function(e){
    var post = this;
    var user = Meteor.user();
    e.preventDefault();
    if(!user){
      Router.go('atSignIn');
      Messages.flash(i18n.t("please_log_in_first"), "info");
    }
    if (user.hasUpvoted(post)) {
      Meteor.call('cancelUpvotePost', post, function(){
        Events.track("post upvote cancelled", {'_id': post._id});
      });        
    } else {
      Meteor.call('upvotePost', post, function(){
        Events.track("post upvoted", {'_id': post._id});
      });  
    }
  },
  'click .downvote-link': function(e){
    var post = this;
    var user = Meteor.user();
    e.preventDefault();
    if(!user){
      Router.go('atSignIn');
      Messages.flash(i18n.t("please_log_in_first"), "info");
    }
    if (user.hasDownvoted(post)) {
      Meteor.call('cancelDownvotePost', post, function(){
        Events.track("post downvote cancelled", {'_id': post._id});
      });        
    } else {
      Meteor.call('downvotePost', post, function(){
        Events.track("post downvoted", {'_id': post._id});
      });  
    }
  }  
});
