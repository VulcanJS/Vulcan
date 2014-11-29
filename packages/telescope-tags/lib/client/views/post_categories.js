Meteor.startup(function () {
  Template[getTemplate('postCategories')].helpers({
    categoriesArray: function(){
      return this.categories.map(function (categoryId) {
        return Categories.findOne(categoryId);
      });
    },
    categoryLink: function(){
      return getCategoryUrl(this.slug);
    }
  });
});