var checkCategories = function(post) {
  if (!post.categories || post.categories.length === 0) {
    return;
  }

  var categoryCount = Categories.find({_id: {$in: post.categories}}).count();

  if (post.categories.length !== categoryCount) {
    throw new Meteor.Error('invalid_category', i18n.t('invalid_category'));
  }
};

postSubmitMethodCallbacks.push(function (post) {
  checkCategories(post);

  return post;
});

postEditMethodCallbacks.push(function (updateObject) {
  var post = updateObject.$set;
  checkCategories(post);

  return updateObject;
});
