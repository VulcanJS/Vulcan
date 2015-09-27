// generate slug on insert
Categories.before.insert(function (userId, doc) {
  // if no slug has been provided, generate one
  var slug = !!doc.slug ? doc.slug : Telescope.utils.slugify(doc.name);
  doc.slug = Telescope.utils.getUnusedSlug(Categories, slug);
});

// generate slug on edit
Categories.before.update(function (userId, doc, fieldNames, modifier) {
  if (modifier.$set && modifier.$set.slug) {
    modifier.$set.slug = Telescope.utils.getUnusedSlug(Categories, modifier.$set.slug);
  }
});

// add callback that adds categories CSS classes
function addCategoryClass (postClass, post) {
  var classArray = _.map(Posts.getCategories(post), function (category){return "category-"+category.slug;});
  return postClass + " " + classArray.join(' ');
}
Telescope.callbacks.add("postClass", addCategoryClass);

// ------- Categories Check -------- //

// make sure all categories in the post.categories array exist in the db
var checkCategories = function (post) {

  // if there are not categories, stop here
  if (!post.categories || post.categories.length === 0) {
    return;
  }

  // check how many of the categories given also exist in the db
  var categoryCount = Categories.find({_id: {$in: post.categories}}).count();

  if (post.categories.length !== categoryCount) {
    throw new Meteor.Error('invalid_category', i18n.t('invalid_category'));
  }
};

function postSubmitCheckCategories (post) {
  checkCategories(post);
  return post;
}
Telescope.callbacks.add("postSubmit", postSubmitCheckCategories);

function postEditCheckCategories (post) {
  checkCategories(post);
  return post;
}
Telescope.callbacks.add("postEdit", postEditCheckCategories);

function addParentCategoriesOnSubmit (post) {
  var categories = post.categories;
  var newCategories = [];
  if (categories) {
    categories.forEach(function (categoryId) {
      var category = Categories.findOne(categoryId);
      newCategories = newCategories.concat(_.pluck(category.getParents().reverse(), "_id"));
      newCategories.push(category._id);
    });
  }
  post.categories = _.unique(newCategories);
  return post;
}
Telescope.callbacks.add("postSubmit", addParentCategoriesOnSubmit);

function addParentCategoriesOnEdit (modifier, post) {
  if (modifier.$unset && modifier.$unset.categories !== undefined) {
    return modifier;
  }

  var categories = modifier.$set.categories;
  var newCategories = [];
  if (categories) {
    categories.forEach(function (categoryId) {
      var category = Categories.findOne(categoryId);
      newCategories = newCategories.concat(_.pluck(category.getParents().reverse(), "_id"));
      newCategories.push(category._id);
    });
  }
  modifier.$set.categories = _.unique(newCategories);
  return modifier;
}
Telescope.callbacks.add("postEdit", addParentCategoriesOnEdit);
