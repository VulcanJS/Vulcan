Template[getTemplate('mobile_nav')].helpers({
  primaryNav: function () {
    return primaryNav;
  },
  secondaryNav: function () {
    return secondaryNav;
  },
  getTemplate: function () {
    return getTemplate(this);
  },
  canPost: function(){
    return canPost(Meteor.user());
  },
  requirePostsApproval: function(){
    return getSetting('requirePostsApproval');
  },
  userMenu: function () {
    return getTemplate('userMenu');
  }
});

Template[getTemplate('mobile_nav')].events({
  'click .dropdown-sub-level': function () {
    $('body').toggleClass('mobile-nav-open');
  }
});

Template[getTemplate('mobile_nav')].rendered = function () {
  $('.mobile-nav .dropdown-menu').hide();
};

Template[getTemplate('mobile_nav')].events({
  'click .dropdown-top-level': function (e) {
    e.preventDefault();
    $(e.currentTarget).next().slideToggle('fast');
  },
  'click .mobile-nav a': function (e) {
    if (e.target.className.indexOf('dropdown-top-level') == -1){
      $('body').removeClass('mobile-nav-open');
    }
  }
});