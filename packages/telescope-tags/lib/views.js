// Category View
// Add a view that will be specifically triggered by setting "view" to "category" 
// in a route or template controller
Posts.views.add("category", function (terms) {
  var category = Categories.findOne({slug: terms.category});
  var childCategories = category.getChildren(category);
  var categoriesIds = [category._id].concat(_.pluck(childCategories, "_id"));
  return {
    find: {'categories': {$in: categoriesIds}}
  };
});

// Category Parameter
// Add a "categories" property which will be used to filter *all* existing Posts views. 
function addCategoryParameter (parameters, terms) {
  // filter by category if category _id is provided (unless categories parameter already specificed)
  if (!!terms.category && !parameters.find.categories) {
    var categoryId = Categories.findOne({slug: terms.category})._id;
    parameters.find.categories = {$in: [categoryId]};
  }
  return parameters;
}
Telescope.callbacks.add("postsParameters", addCategoryParameter);