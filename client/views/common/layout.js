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
  backgroundCSS: function(){
  	return getSetting('backgroundCSS');
  },
  secondaryColor: function(){
  	return getSetting('secondaryColor');
  },
  buttonColor: function(){
  	return getSetting('buttonColor');
  },
  headerColor: function(){
  	return getSetting('headerColor');
  },
  extraCode: function(){
    return getSetting('extraCode');
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