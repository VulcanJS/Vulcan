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

// when a category is added to a post, increment counter
function updateCategoryCountOnSubmit (post) {
  if (!_.isEmpty(post.categories))
    Categories.update({_id: {$in: post.categories}}, {$inc: {"postsCount": 1}}, {multi: true});
}
Telescope.callbacks.add("postSubmitAsync", updateCategoryCountOnSubmit);

function updateCategoryCountOnEdit (newPost, oldPost) {
  
  var categoriesAdded = _.difference(newPost.categories, oldPost.categories);
  var categoriesRemoved = _.difference(oldPost.categories, newPost.categories);

  if (!_.isEmpty(categoriesAdded))
    Categories.update({_id: {$in: categoriesAdded}}, {$inc: {"postsCount": 1}}, {multi: true});
  
  if (!_.isEmpty(categoriesRemoved))
    Categories.update({_id: {$in: categoriesRemoved}}, {$inc: {"postsCount": -1}}, {multi: true});
}
Telescope.callbacks.add("postEditAsync", updateCategoryCountOnEdit);

// when a post is deleted, decrement counter
function updateCategoryCountOnDelete (post) {
  Categories.update({_id: {$in: post.categories}}, {$inc: {"postsCount": -1}}, {multi: true});
}
Telescope.callbacks.add("postDeleteAsync", updateCategoryCountOnDelete);

