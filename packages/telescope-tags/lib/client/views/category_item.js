Meteor.startup(function () {
  Template[getTemplate('categoryItem')].helpers({
    formId: function () {
      return 'updateCategory-'+ this.slug
    }
  });
});
