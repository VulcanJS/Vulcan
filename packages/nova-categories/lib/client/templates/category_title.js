Template.category_title.helpers({
  categories: function () {
    var slugs = FlowRouter.getQueryParam("cat");
    if (typeof slugs !== "undefined") {
      if (typeof slugs === "string") {
        slugs = [slugs];
      }
      return Categories.find({slug: {$in: slugs}});
    }
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