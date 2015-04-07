Template[getTemplate('mobile_nav')].helpers({
  mobileNav: function () {
    return _.sortBy(mobileNav, 'order');
  },
  logoTemplate: function () {
    return getTemplate('logo');
  },
  getTemplate: function () {
    return getTemplate(this.template);
  },
  mobileContext: function () {
    return {mobile: true};
  }
});

Template[getTemplate('mobile_nav')].events({
  'click .menu-sub-level': function () {
    $('body').toggleClass('mobile-nav-open');
  }
});

Template[getTemplate('mobile_nav')].events({
  'click .menu-top-level': function (e) {
    e.preventDefault();
    $(e.currentTarget).next().slideToggle('fast');
  },
  'click .mobile-nav a': function (e) {
    if (e.target.className.indexOf('menu-top-level') == -1){
      $('body').removeClass('mobile-nav-open');
    }
  }
});