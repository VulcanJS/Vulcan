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
  'click .dropdown-sub-level':function(event){
    $('body').toggleClass('mobile-nav-open');
  }
});

Template[getTemplate('mobile_nav')].rendered = function () {
  $('.mobile-nav .dropdown-menu').hide();
}

Template[getTemplate('mobile_nav')].events({
  'click .dropdown-top-level': function(e){
    e.preventDefault();
    $(e.currentTarget).next().slideToggle('fast');
  }
});