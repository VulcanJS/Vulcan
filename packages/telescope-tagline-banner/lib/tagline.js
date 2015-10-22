Telescope.modules.add("contentTop", {
  template: "tagline_banner",
  order: 1,
  only: ["postsDefault"]
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
