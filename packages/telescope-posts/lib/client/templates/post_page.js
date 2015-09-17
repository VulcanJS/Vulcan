Template.post_page.onCreated(function () {

  var template = this;
  var postId = FlowRouter.getParam("_id");

  // initialize the reactive variables
  template.ready = new ReactiveVar(false);

  var postSubscription = Telescope.subsManager.subscribe('singlePost', postId);
  var postUsersSubscription = Telescope.subsManager.subscribe('postUsers', postId);
  var commentSubscription = Telescope.subsManager.subscribe('commentsList', {view: 'postComments', postId: postId});
  
  // Autorun 3: when subscription is ready, update the data helper's terms
  template.autorun(function () {

    var subscriptionsReady = postSubscription.ready(); // ⚡ reactive ⚡

    // if subscriptions are ready, set terms to subscriptionsTerms
    if (subscriptionsReady) {
      template.ready.set(true);
    }
  });

});

Template.post_page.helpers({
  ready: function () {
    return Template.instance().ready.get();
  },
  post: function () {
    return Posts.findOne(FlowRouter.getParam("_id"));
  },
  canView: function () {
    var post = this;
    var user = Meteor.user();
    if (post.status === Posts.config.STATUS_PENDING && !Users.can.viewPendingPost(user, post)) {
      return false;
    } else if (post.status === Posts.config.STATUS_REJECTED && !Users.can.viewRejectedPost(user, post)) {
      return false;
    }
    return true;
  },
  isPending: function () {
    return this.status === Posts.config.STATUS_PENDING;
  }
});

Template.post_page.rendered = function(){
  $('body').scrollTop(0);
};
