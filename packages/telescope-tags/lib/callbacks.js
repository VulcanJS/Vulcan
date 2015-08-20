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
