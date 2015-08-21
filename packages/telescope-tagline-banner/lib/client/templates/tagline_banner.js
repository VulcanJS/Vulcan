Template.tagline_banner.helpers({
  showTaglineBanner: function () {
    return !!Settings.get('tagline') && !!Settings.get('showTaglineBanner');
  }
});

