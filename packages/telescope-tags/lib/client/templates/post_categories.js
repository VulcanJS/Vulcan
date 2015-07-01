Meteor.startup(function () {
  Template.post_categories.helpers({
    categoriesArray: function(){
      return _.map(this.categories, function (categoryId) { // note: this.categories maybe be undefined
        return Categories.findOne(categoryId);
      });
    },
    categoryLink: function(){
      return Categories.getUrl(this.slug);
    }
  });
});