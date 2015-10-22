Meteor.methods({
  removeCategory: function (categoryId) {
    
    check(categoryId, String);

    if (Users.is.admin(this.userId)) {

      var category = Categories.findOne(categoryId);

      // delete category
      Categories.remove(categoryId);

      // find any direct children of this category and make them root categories
      Categories.find({parentId: categoryId}).forEach(function (category) {
        Categories.update(category._id, {$unset: {parentId: ""}});
      });

      // find any post with this category and remove it
      var postsUpdated = Posts.update({categories: {$in: [categoryId]}}, {$pull: {categories: categoryId}}, {multi: true});

      return postsUpdated;

    }
  }
});