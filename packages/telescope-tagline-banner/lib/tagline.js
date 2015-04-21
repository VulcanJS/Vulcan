postListTopModules.push({
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
      group: 'general',
      instructions: 'Show tagline on homepage.'
    }
  }
};
Settings.addToSchema(showTaglineBanner);
