Template.category_title.helpers({
  category: function () {
    return Router.current().getCurrentCategory();
  },
  categoryParents: function () {
    var category = this;
    var parents = category.getParents().reverse();
    console.log(parents)
    return parents;
  },
  title: function () {
    var category = this;
    return category && category.name;
  }
});