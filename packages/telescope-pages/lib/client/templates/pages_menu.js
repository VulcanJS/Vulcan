Template[getTemplate("pagesMenu")].helpers({
  pages: function () {
    return Pages.collection.find();
  }
})