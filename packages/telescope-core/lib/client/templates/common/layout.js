Template.layout.onCreated(function (){

  DocHead.setTitle(i18n.t("loading"));

  Tracker.autorun(function () {

    if (FlowRouter.subsReady()) {

      var title = Settings.get("title", "Telescope");
      if (!!Settings.get("tagline")) {
        title += ": "+Settings.get("tagline");
      }
      DocHead.setTitle(title);

      if (!!Settings.get("description")) {
        DocHead.addMeta({name: "description", content: Settings.get("description")});
        DocHead.addMeta({property: "og:description", content: Settings.get("description")});
      }

      if (!!Settings.get("siteImage")) {
        DocHead.addMeta({property: "og:image", content: Settings.get("siteImage")});
      }

    }
  
  });

});

Template.layout.helpers({
  appIsReady: function () {
    return FlowRouter.subsReady();
  },
  navLayout: function () {
    return Settings.get('navLayout', 'top-nav');
  },
  pageName : function(){
    return FlowRouter.current().route.name;
  },
  extraCode: function() {
    return Settings.get('extraCode');
  }
});

Template.layout.onCreated( function () {
  Session.set('currentScroll', null);
});

Template.layout.onRendered( function () {
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
});

Template.layout.events({
  'click .inner-wrapper': function (e) {
    if ($('body').hasClass('mobile-nav-open')) {
      e.preventDefault();
      $('body').removeClass('mobile-nav-open');
    }
  }
});
