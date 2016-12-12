import Posts from "meteor/nova:posts";
import Categories from "./collection.js";
import { Callbacks, Utils } from 'meteor/nova:core';

// generate slug on insert
// Categories.before.insert(function (userId, doc) {
//   // if no slug has been provided, generate one
//   var slug = !!doc.slug ? doc.slug : Utils.slugify(doc.name);
//   doc.slug = Utils.getUnusedSlug(Categories, slug);
// });

// // generate slug on edit, if it has changed
// Categories.before.update(function (userId, doc, fieldNames, modifier) {
//   if (modifier.$set && modifier.$set.slug && modifier.$set.slug !== doc.slug) {
//     modifier.$set.slug = Utils.getUnusedSlug(Categories, modifier.$set.slug);
//   }
// });

// add callback that adds categories CSS classes
function addCategoryClass (postClass, post) {
  var classArray = _.map(Posts.getCategories(post), function (category){return "category-"+category.slug;});
  return postClass + " " + classArray.join(' ');
}
Callbacks.add("postClass", addCategoryClass);

// ------- Categories Check -------- //

// make sure all categories in the post.categories array exist in the db
var checkCategories = function (post) {

  // if there are no categories, stop here
  if (!post.categories || post.categories.length === 0) {
    return;
  }

  // check how many of the categories given also exist in the db
  var categoryCount = Categories.find({_id: {$in: post.categories}}).count();

  if (post.categories.length !== categoryCount) {
    throw new Meteor.Error('invalid_category', 'invalid_category');
  }
};

function postsNewCheckCategories (post) {
  checkCategories(post);
  return post;
}
Callbacks.add("posts.new.sync", postsNewCheckCategories);

function postEditCheckCategories (modifier) {
  checkCategories(modifier.$set);
  return modifier;
}
Callbacks.add("posts.edit.sync", postEditCheckCategories);

function categoriesNewGenerateSlug (category) {
  // if no slug has been provided, generate one
  const slug = category.slug || Utils.slugify(category.name);
  category.slug = Utils.getUnusedSlug(Categories, slug);
  return category;
}
Callbacks.add("categories.new.sync", categoriesNewGenerateSlug);

function categoriesEditGenerateSlug (modifier) {
  // if slug is changing
  if (modifier.$set && modifier.$set.slug) {
    const slug = modifier.$set.slug;
    modifier.$set.slug = Utils.getUnusedSlug(Categories, slug);
  }
  return modifier;
}
Callbacks.add("categories.edit.sync", categoriesEditGenerateSlug);

// TODO: debug this

// function addParentCategoriesOnSubmit (post) {
//   var categories = post.categories;
//   var newCategories = [];
//   if (categories) {
//     categories.forEach(function (categoryId) {
//       var category = Categories.findOne(categoryId);
//       newCategories = newCategories.concat(_.pluck(category.getParents().reverse(), "_id"));
//       newCategories.push(category._id);
//     });
//   }
//   post.categories = _.unique(newCategories);
//   return post;
// }
// Callbacks.add("posts.new.sync", addParentCategoriesOnSubmit);

// function addParentCategoriesOnEdit (modifier, post) {
//   if (modifier.$unset && modifier.$unset.categories !== undefined) {
//     return modifier;
//   }

//   var categories = modifier.$set.categories;
//   var newCategories = [];
//   if (categories) {
//     categories.forEach(function (categoryId) {
//       var category = Categories.findOne(categoryId);
//       newCategories = newCategories.concat(_.pluck(category.getParents().reverse(), "_id"));
//       newCategories.push(category._id);
//     });
//   }
//   modifier.$set.categories = _.unique(newCategories);
//   return modifier;
// }
// Callbacks.add("posts.edit.sync", addParentCategoriesOnEdit);
