Telescope.modules.register("postListTop", {
  template: 'taglineBanner',
  order: 1
});

var showTaglineBanner = {
  propertyName: 'showTaglineBanner',
  propertySchema: {
    type: Boolean,
    optional: true,
    label: 'Tagline banner',
    autoform: {
      group: '01_general',
      instructions: 'Show tagline on homepage.'
    }
  }
};
Settings.registerField(showTaglineBanner);
