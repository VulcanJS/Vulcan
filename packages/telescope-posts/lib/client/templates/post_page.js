Template.post_page.helpers({
  isPending: function () {
    return this.status === Posts.config.STATUS_PENDING;
  }
});

Template.post_page.rendered = function(){
  $('body').scrollTop(0);
};
