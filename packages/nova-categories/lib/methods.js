import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';
import Categories from "./collection.js";

Meteor.methods({
  "categories.deleteById": function (categoryId) {
    
    check(categoryId, String);
    
    const currentUser = this.userId && Users.findOne(this.userId);

    if (Users.canDo(currentUser, "categories.remove.all")) {

      // delete category
      Categories.remove(categoryId);

      // find any direct children of this category and make them root categories
      Categories.find({parentId: categoryId}).forEach(function (category) {
        Categories.update(category._id, {$unset: {parentId: ""}});
      });

      // find any posts with this category and remove it
      var postsUpdated = Posts.update({categories: {$in: [categoryId]}}, {$pull: {categories: categoryId}}, {multi: true});

      return postsUpdated;

    }
  }
});

Categories.smartMethods({
  createName: "categories.new",
  editName: "categories.edit"
});