Template.logo.helpers({
  logoUrl: function(){
    return Settings.get('logoUrl');
  }
});

Template.logo.onRendered(function  () {
  $('.logo-text').quickfit({
    min: 24,
    max: 100,
    truncate: false
  });
});