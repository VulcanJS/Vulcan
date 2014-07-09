Template[getTemplate('mobile_nav')].helpers({
  navItems: function () {
    return navItems;
  },
  canPost: function(){
    return canPost(Meteor.user());
  },
  requirePostsApproval: function(){
    return getSetting('requirePostsApproval');
  }
});

Template[getTemplate('mobile_nav')].events({
  'click .mobile-nav a':function(event){
    $('body').toggleClass('mobile-nav-open');
  }
});