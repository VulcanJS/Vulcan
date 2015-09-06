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


// ------- PostsCount --------- //

// when a post is submitted, increment counter (assuming it's approved)
function updatePostsCountOnSubmit (post) {
  if (post.isApproved() && !_.isEmpty(post.categories))
    Categories.update({_id: {$in: post.categories}}, {$inc: {"postsCount": 1}}, {multi: true});
}
Telescope.callbacks.add("postSubmitAsync", updatePostsCountOnSubmit);

// when a post is approved, increment counter
function updatePostsCountOnApprove (post) {
  if (!_.isEmpty(post.categories))
    Categories.update({_id: {$in: post.categories}}, {$inc: {"postsCount": 1}}, {multi: true});
}
Telescope.callbacks.add("postApproveAsync", updatePostsCountOnApprove);

// when a post is unapproved, decrement counter
function updatePostsCountOnReject (post) {
  if (!_.isEmpty(post.categories))
    Categories.update({_id: {$in: post.categories}}, {$inc: {"postsCount": -1}}, {multi: true});
}
Telescope.callbacks.add("postRejectAsync", updatePostsCountOnReject);

function updatePostsCountOnEdit (newPost, oldPost) {
    var categoriesAdded = _.difference(newPost.categories, oldPost.categories);
    var categoriesRemoved = _.difference(oldPost.categories, newPost.categories);

    if (!_.isEmpty(categoriesAdded))
      Categories.update({_id: {$in: categoriesAdded}}, {$inc: {"postsCount": 1}}, {multi: true});
    
    if (!_.isEmpty(categoriesRemoved))
      Categories.update({_id: {$in: categoriesRemoved}}, {$inc: {"postsCount": -1}}, {multi: true});
}
Telescope.callbacks.add("postEditAsync", updatePostsCountOnEdit);

// when a post is deleted, decrement counter
function updateCategoryCountOnDelete (post) {
  Categories.update({_id: {$in: post.categories}}, {$inc: {"postsCount": -1}}, {multi: true});
}
Telescope.callbacks.add("postDeleteAsync", updateCategoryCountOnDelete);

