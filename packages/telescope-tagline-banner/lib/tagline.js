Telescope.modules.add("postsListTop", {
  template: "tagline_banner",
  order: 1
});

var showTaglineBanner = {
  fieldName: 'showTaglineBanner',
  fieldSchema: {
    type: Boolean,
    optional: true,
    autoform: {
      group: '01_general',
      instructions: 'Show tagline on homepage.'
    }
  }
};
Settings.addField(showTaglineBanner);
