import { Posts } from '../posts/index.js';
import { Categories } from './collection.js';
import { Utils } from 'meteor/vulcan:core';

/**
 * @summary Get all of a category's parents
 * @param {Object} category
 */
Categories.getParents = function (category, store) {
  const categoriesArray = [];
  const getParents = function recurse (category) {
    if (category && category.parentId) {
      const parent = store ? Categories.findOneInStore(store, category.parentId) : Categories.findOne(category.parentId);
      if (parent) {
        categoriesArray.push(parent);
        recurse(parent);
      }
    }
  };
  getParents(category);

  return categoriesArray;
};

/**
 * @summary Get all of a category's children
 * @param {Object} category
 */
Categories.getChildren = function (category) {
  var categoriesArray = [];

  var getChildren = function recurse (categories) {
    var children = Categories.find({parentId: {$in: _.pluck(categories, '_id')}}).fetch()
    if (children.length > 0) {
      categoriesArray = categoriesArray.concat(children);
      recurse(children);
    }
  };
  getChildren([category]);

  return categoriesArray;
};
/**
 * @summary Get all of a post's categories
 * @param {Object} post
 */
Posts.getCategories = function (post) {
  return !!post.categories ? Categories.find({_id: {$in: post.categories}}).fetch() : [];
};
/**
 * @summary Get a category's URL
 * @param {Object} category
 */
Categories.getUrl = function (category, isAbsolute) {
  isAbsolute = typeof isAbsolute === 'undefined' ? false : isAbsolute; // default to false
  const prefix = isAbsolute ? Utils.getSiteUrl().slice(0,-1) : '';
  // return prefix + FlowRouter.path('postsCategory', category);
  return `${prefix}/?cat=${category.slug}`;
};
/**
 * @summary Get a category's counter name
 * @param {Object} category
 */
Categories.getCounterName = function (category) {
  return category._id + '-postsCount';
}

