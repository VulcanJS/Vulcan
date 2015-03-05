heroModules.push({
  template: 'taglineBanner',
  order: 0
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
}
addToSettingsSchema.push(showTaglineBanner);