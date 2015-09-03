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

// add category parameter to publications/subscriptions
function addCategoryParameter (parameters, terms) {
  // filter by category if category _id is provided (unless categories parameter already specificed)
  if (!!terms.category && !parameters.find.categories) {
    var categoryId = Categories.findOne({slug: terms.category})._id;
    parameters.find.categories = {$in: [categoryId]};
  }
  return parameters;
}
Telescope.callbacks.add("postsParameters", addCategoryParameter);