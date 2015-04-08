Template[getTemplate("pagesMenu")].helpers({
  hasPages: function () {
    return Pages.collection.find().count()
  },
  pages: function () {
    return Pages.collection.find();
  }
})