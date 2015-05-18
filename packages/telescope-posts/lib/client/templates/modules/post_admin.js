Template.post_admin.helpers({
  showApprove: function () {
    return this.status === Posts.config.STATUS_PENDING;
  },
  showUnapprove: function(){
    return !!Settings.get('requirePostsApproval') && this.status === Posts.config.STATUS_APPROVED;
  },
  shortScore: function(){
    return Math.floor(this.score*1000)/1000;
  }
});

Template.post_admin.events({
  'click .approve-link': function(e){
    Meteor.call('approvePost', this);
    e.preventDefault();
  },
  'click .unapprove-link': function(e){
    Meteor.call('unapprovePost', this);
    e.preventDefault();
  }
});
