Template.page.onCreated(function () {
  Telescope.SEO.set({
    title: Pages.findOne({slug: FlowRouter.getParam("slug")}).title
  });
});

Template.page.helpers({
  page: function () {
    return Pages.findOne({slug: FlowRouter.getParam("slug")});
  }
});