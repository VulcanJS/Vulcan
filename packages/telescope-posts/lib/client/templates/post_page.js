Template.post_page.helpers({
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
