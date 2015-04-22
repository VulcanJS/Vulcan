Template.postListTop.helpers({
  postListTopModules: function () {
    return _.sortBy(postListTopModules, 'order');
  }
});
