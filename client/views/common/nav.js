Template.nav.helpers({
  site_title: function(){
    return getSetting('title');
  },
  logo_url: function(){
    return getSetting('logoUrl');
  },
  logo_height: function(){
    return getSetting('logoHeight');
  },
  logo_width: function(){
    return getSetting('logoWidth');
  },
  logo_top: function(){
    return Math.floor((70-getSetting('logoHeight'))/2);
  },  
  logo_offset: function(){
    return -Math.floor(getSetting('logoWidth')/2);
  },
  intercom: function(){
    return !!getSetting('intercomId');
  },
  canPost: function(){
    return canPost(Meteor.user());
  },
  requirePostsApproval: function(){
    return getSetting('requirePostsApproval');
  },
  hasCategories: function(){
    return Categories.find().count();
  },
  categories: function(){
    return Categories.find();
  },
  categoryLink: function () {
    return getCategoryUrl(this.slug);
  }
});

Template.nav.rendered=function(){

  if(!Meteor.user()){
    $('.login-link-text').text("Sign Up/Sign In");
  }else{
    $('#login-buttons-logout').before('<a href="/users/'+Meteor.user().slug+'" class="account-link button">View Profile</a>');
    $('#login-buttons-logout').before('<a href="/account" class="account-link button">Edit Account</a>');
  }
};

Template.nav.events({
  'click #logout': function(e){
    e.preventDefault();
    Meteor.logout();
  },
  'click #mobile-menu': function(e){
    e.preventDefault();
    $('body').toggleClass('mobile-nav-open');
  },
  'click .login-header': function(e){
    e.preventDefault();
    Router.go('/account');
  }
});