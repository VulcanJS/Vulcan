Template[getTemplate('taglineBanner')].helpers({
  showTaglineBanner: function () {
    return !!Settings.get('tagline') && !!Settings.get('showTaglineBanner');
  }
});

