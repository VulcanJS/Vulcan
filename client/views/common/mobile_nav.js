Template.mobile_nav.events({
  'click .mobile-nav a':function(event){
    $('body').toggleClass('mobile-nav-open');
  }
});