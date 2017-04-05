import Posts from "meteor/vulcan:posts";
import Categories from "./collection.js";
import { addCallback, Utils } from 'meteor/vulcan:core';

// add callback that adds categories CSS classes
function addCategoryClass (postClass, post) {
  var classArray = _.map(Posts.getCategories(post), function (category){return "category-"+category.slug;});
  return postClass + " " + classArray.join(' ');
}
addCallback("postClass", addCategoryClass);

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
    throw new Error({id: 'categories.invalid'});
  }
};

function postsNewCheckCategories (post) {
  checkCategories(post);
  return post;
}
addCallback("posts.new.sync", postsNewCheckCategories);

function postEditCheckCategories (modifier) {
  checkCategories(modifier.$set);
  return modifier;
}
addCallback("posts.edit.sync", postEditCheckCategories);

function categoriesNewGenerateSlug (category) {
  // if no slug has been provided, generate one
  const slug = category.slug || Utils.slugify(category.name);
  category.slug = Utils.getUnusedSlug(Categories, slug);
  return category;
}
addCallback("categories.new.sync", categoriesNewGenerateSlug);

function categoriesEditGenerateSlug (modifier, document) {
  // if slug is changing
  if (modifier.$set && modifier.$set.slug && modifier.$set.slug !== document.slug) {
    const slug = modifier.$set.slug;
    modifier.$set.slug = Utils.getUnusedSlug(Categories, slug);
  }
  return modifier;
}
addCallback("categories.edit.sync", categoriesEditGenerateSlug);

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
// addCallback("posts.new.sync", addParentCategoriesOnSubmit);

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
// addCallback("posts.edit.sync", addParentCategoriesOnEdit);
