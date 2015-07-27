Template.post_page.helpers({
  isPending: function () {
    return this.post && this.post.status === Posts.config.STATUS_PENDING;
  }
});

Template.post_page.rendered = function(){
  $('body').scrollTop(0);
};
