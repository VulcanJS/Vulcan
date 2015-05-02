Template.mobile_nav.helpers({
  mobileContext: function () {
    return {mobile: true};
  }
});

Template.mobile_nav.events({
  'click .menu-sub-level': function () {
    $('body').toggleClass('mobile-nav-open');
  }
});

Template.mobile_nav.events({
  'click .menu-top-level': function (e) {
    e.preventDefault();
    $(e.currentTarget).next().slideToggle('fast');
  },
  'click .mobile-nav a': function (e) {
    if (e.target.className.indexOf('menu-top-level') === -1){
      $('body').removeClass('mobile-nav-open');
    }
  }
});
