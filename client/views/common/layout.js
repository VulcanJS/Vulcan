function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

Template[getTemplate('layout')].helpers({
  mobile_nav: function () {
    return getTemplate('mobile_nav');
  },
  nav: function () {
    return getTemplate('nav');
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
  heroModules: function () {
    return heroModules;
  },
  getTemplate: function () {
    return getTemplate(this.template);
  },
  notInIframe: function() {
    return !inIframe();
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
};
