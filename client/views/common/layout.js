Template[getTemplate('layout')].helpers({
  mobile_nav: function () {
    return getTemplate('mobile_nav');
  },
  nav: function () {
    return getTemplate('nav');
  },
  error: function () {
    return getTemplate('error');
  },
  notifications: function () {
    return getTemplate('notifications');
  },
  footer: function () {
    return getTemplate('footer');
  },
  pageName : function(){
    // getCurrentTemplate();
  },
  css: function () {
    return getTemplate('css');
  },
  heroModules: function () {
    return heroModules;
  },
  getTemplate: function () {
    return getTemplate(this.template);
  }
});

Template[getTemplate('layout')].created = function(){
  Session.set('currentScroll', null);
}

Template[getTemplate('layout')].rendered = function(){
  if(currentScroll=Session.get('currentScroll')){
    $('body').scrollTop(currentScroll);
    Session.set('currentScroll', null);
  }
}

Template.layout.events({
  'click .outer-wrapper':function(e){
      var container = $("#login-dropdown-list");
      var container2 = $("#login-name-link");
      if (!container.is(e.target) && !container2.is(e.target)
         && container.has(e.target).length === 0 && container2.has(e.target).length === 0)
     {
        Accounts._loginButtonsSession.closeDropdown();
     }
 }
});