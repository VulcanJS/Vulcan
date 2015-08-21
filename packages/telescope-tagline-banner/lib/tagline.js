Telescope.modules.add("top", {
  template: "tagline_banner",
  order: 1,
  only: ["posts_default"]
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
