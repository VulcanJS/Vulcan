// Category View
// Add a view that will be specifically triggered by setting "view" to "category" 
// in a route or template controller
Posts.views.add("category", function (terms) {

  var categoriesIds = [];
  
  // get all categories passed in terms
  var categories = Categories.find({slug: {$in: terms.categorySlugs}}).fetch();

  // for each category, add its ID and the IDs of its children to categoriesId array
  categories.forEach(function (category) {
    categoriesIds.push(category._id);
    categoriesIds = categoriesIds.concat(_.pluck(category.getChildren(), "_id"));
  });

  return {
    find: {'categories': {$in: categoriesIds}}
  };

});

// Category Parameter
// Add a "categories" property to terms which can be used to filter *all* existing Posts views. 
function addCategoryParameter (parameters, terms) {
  // filter by category if category slugs are provided (unless post's "categories" parameter already specificed)
  if (!!terms.categorySlugs && !parameters.find.categories) {
    var categoriesId =_.pluck(Categories.find({slug: {$in: terms.categorySlugs}}).fetch(), "_id");
    parameters.find.categories = {$in: [categoriesId]};
  }
  return parameters;
}
Telescope.callbacks.add("postsParameters", addCategoryParameter);