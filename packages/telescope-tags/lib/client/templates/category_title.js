Template.category_title.helpers({
  category: function () {
    return Router.current().getCurrentCategory();
  },
  title: function () {
    var category = this;
    return category && category.name;
  }
});