Template[getTemplate('layout')].helpers({
  mobile_nav: function () {
    return getTemplate('mobile_nav');
  },
  nav: function () {
    return getTemplate('nav');
  },
  navLayout: function () {
    return Settings.get('navLayout', 'top-nav');
  },
  messages: function () {
    return getTemplate('messages');
  },
  notifications: function () {
    return getTemplate('notifications');
  },
  footer: function () {
    return getTemplate('footer');
  },
  pageName : function(){
    return getCurrentTemplate();
  },
  css: function () {
    return getTemplate('css');
  },
  extraCode: function() {
    return Settings.get('extraCode');
  },
  heroModules: function () {
    return _.sortBy(heroModules, 'order');
  },
  getTemplate: function () {
    return getTemplate(this.template);
  }
});

Template[getTemplate('layout')].created = function(){
  Session.set('currentScroll', null);
};

Template[getTemplate('layout')].rendered = function(){
  if(currentScroll=Session.get('currentScroll')){
    $('body').scrollTop(currentScroll);
    Session.set('currentScroll', null);
  }

  // favicon
  var link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = Settings.get('faviconUrl', '/img/favicon.ico');
  document.getElementsByTagName('head')[0].appendChild(link);

};

Template[getTemplate('layout')].events({
  'click .inner-wrapper': function (e) {
    if ($('body').hasClass('mobile-nav-open')) {
      e.preventDefault();
      $('body').removeClass('mobile-nav-open');
    }
  }
});
