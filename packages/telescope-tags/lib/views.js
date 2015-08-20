
// category post list parameters
Posts.views.add("category", function (terms) {
  var category = Categories.findOne({slug: terms.category});
  var childCategories = category.getChildren(category);
  var categoriesIds = [category._id].concat(_.pluck(childCategories, "_id"));
  return {
    find: {'categories': {$in: categoriesIds}} ,
    options: {sort: {sticky: -1, score: -1}} // for now categories views default to the "top" view
  };
});