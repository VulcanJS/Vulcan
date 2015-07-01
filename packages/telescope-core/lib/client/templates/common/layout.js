Template.layout.helpers({
  navLayout: function () {
    return Settings.get('navLayout', 'top-nav');
  },
  pageName : function(){
    return Telescope.utils.getCurrentTemplate();
  },
  extraCode: function() {
    return Settings.get('extraCode');
  }
});

Template.layout.created = function(){
  Session.set('currentScroll', null);
};

Template.layout.rendered = function(){
  var currentScroll = Session.get('currentScroll');
  if(currentScroll){
    $('body').scrollTop(currentScroll);
    Session.set('currentScroll', null);
  }

  // favicon
  var link = document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = Settings.get('faviconUrl', '/img/favicon.ico');
  document.getElementsByTagName('head')[0].appendChild(link);

  // canonical
  var canonicalLink = document.createElement('link');
  canonicalLink.rel = 'canonical';
  document.getElementsByTagName('head')[0].appendChild(canonicalLink);
};

Template.layout.events({
  'click .inner-wrapper': function (e) {
    if ($('body').hasClass('mobile-nav-open')) {
      e.preventDefault();
      $('body').removeClass('mobile-nav-open');
    }
  }
});
