Template.mobile_nav.events({
  'click .mobile-nav a': function (e) {
    if ($(e.target).closest("a").attr("href") !== "#"){
      $('body').removeClass('mobile-nav-open');
    }
  }
});
