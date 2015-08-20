
/**
 * Get all of a category's parents
 * @param {Object} category
 */
Categories.getParents = function (category) {
  var categoriesArray = [];

  var getParents = function recurse (category) {
    var parent;
    if (parent = Categories.findOne(category.parentId)) {
      categoriesArray.push(parent);
      recurse(parent);
    }
  }(category);

  return categoriesArray;
};
Categories.helpers({getParents: function () {return Categories.getParents(this);}});

/**
 * Get all of a category's children
 * @param {Object} category
 */
Categories.getChildren = function (category) {
  var categoriesArray = [];

  var getChildren = function recurse (categories) {
    var children = Categories.find({parentId: {$in: _.pluck(categories, "_id")}}).fetch()
    if (children.length > 0) {
      categoriesArray = categoriesArray.concat(children);
      recurse(children);
    }
  }([category]);

  return categoriesArray;
};
Categories.helpers({getChildren: function () {return Categories.getChildren(this);}});

/**
 * Get all of a post's categories
 * @param {Object} post
 */
Posts.getCategories = function (post) {
  return !!post.categories ? Categories.find({_id: {$in: post.categories}}).fetch() : [];
};
Posts.helpers({getCategories: function () {return Posts.getCategories(this);}});

/**
 * Get a category's URL
 * @param {Object} category
 */
Categories.getUrl = function(category){
  return Router.path("posts_category", {slug: category.slug});
};
Categories.helpers({getUrl: function () {return Categories.getUrl(this);}});
