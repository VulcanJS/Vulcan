Template[getTemplate('taglineBanner')].helpers({
  showTaglineBanner: function () {
    return Router.current().location.get().path == '/' && !!getSetting('tagline') && !!getSetting('showTaglineBanner');
  }
});

