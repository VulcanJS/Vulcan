Template[getTemplate('taglineBanner')].helpers({
  showBanner: function () {
    return Router.current().location.get().path == '/' && !!getSetting('tagline') && !!getSetting('showTagline');
  }
});

