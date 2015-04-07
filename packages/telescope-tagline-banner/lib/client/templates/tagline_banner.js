Template[getTemplate('taglineBanner')].helpers({
  showTaglineBanner: function () {
    return !!getSetting('tagline') && !!getSetting('showTaglineBanner');
  }
});

