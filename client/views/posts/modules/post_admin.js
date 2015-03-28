Template[getTemplate('postAdmin')].helpers({
  showApprove: function () {
    return this.status == STATUS_PENDING;
  },
  showUnapprove: function(){
    return !!Settings.get('requirePostsApproval') && this.status == STATUS_APPROVED;
  },
  shortScore: function(){
    return Math.floor(this.score*1000)/1000;
  }
});

Template[getTemplate('postAdmin')].events({
  'click .approve-link': function(e, instance){
    Meteor.call('approvePost', this);
    e.preventDefault();
  },
  'click .unapprove-link': function(e, instance){
    Meteor.call('unapprovePost', this);
    e.preventDefault();
  }
});
