/*


Callbacks to validate categories and generate category slugs

*/

import { addCallback } from 'meteor/vulcan:core';
import { Categories } from '../../modules/categories/collection.js';

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

function PostsNewCheckCategories (post) {
  checkCategories(post);
  return post;
}
addCallback("posts.new.sync", PostsNewCheckCategories);

function PostEditCheckCategories (modifier) {
  checkCategories(modifier.$set);
  return modifier;
}
addCallback("posts.edit.sync", PostEditCheckCategories);

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
