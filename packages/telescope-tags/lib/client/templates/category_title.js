Template.category_title.helpers({
  categories: function () {
    return Router.current().getCurrentCategories();
  },
  categoryParents: function () {
    var category = this;
    var parents = category.getParents().reverse();
    return parents;
  },
  title: function () {
    var category = this;
    return category && category.name;
  }
});