Template.tagline_banner.helpers({
  showTaglineBanner: function () {
    return Router.current().route.options.name === "posts_default" 
      && !!Settings.get('tagline') 
      && !!Settings.get('showTaglineBanner');
  }
});

