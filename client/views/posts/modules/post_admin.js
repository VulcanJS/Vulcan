Template[getTemplate('postAdmin')].helpers({
  postsMustBeApproved: function () {
    return !!getSetting('requirePostsApproval');
  },
  isApproved: function(){
    return this.status == STATUS_APPROVED;
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