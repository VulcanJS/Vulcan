Telescope.modules.register("postListTop", {
  template: 'tagline_banner',
  order: 1
});

var showTaglineBanner = {
  propertyName: 'showTaglineBanner',
  propertySchema: {
    type: Boolean,
    optional: true,
    autoform: {
      group: '01_general',
      instructions: 'Show tagline on homepage.'
    }
  }
};
Settings.registerField(showTaglineBanner);
