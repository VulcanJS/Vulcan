Template.pagesMenu.helpers({
  hasPages: function () {
    return Pages.find().count();
  },
  pages: function () {
    return Pages.find();
  }
});
