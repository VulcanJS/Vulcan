Template.postListTop.helpers({
  postListTopModules: function () {
    return _.sortBy(postListTopModules, 'order');
  },
  getTemplate: function () {
    return getTemplate(this.template);
  }
});
