import Telescope from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import Categories from "./collection.js";

Categories.helpers({getCollection: () => Categories});
Categories.helpers({getCollectionName: () => "categories"});

/**
 * @summary Get all of a category's parents
 * @param {Object} category
 */
Categories.getParents = function (category) {
  const categoriesArray = [];

  const getParents = function recurse (category) {
    const parent = Categories.findOne(category.parentId);
    if (parent) {
      categoriesArray.push(parent);
      recurse(parent);
    }
  };
  getParents(category);

  return categoriesArray;
};
Categories.helpers({getParents: function () {return Categories.getParents(this);}});

/**
 * @summary Get all of a category's children
 * @param {Object} category
 */
Categories.getChildren = function (category) {
  var categoriesArray = [];

  var getChildren = function recurse (categories) {
    var children = Categories.find({parentId: {$in: _.pluck(categories, "_id")}}).fetch()
    if (children.length > 0) {
      categoriesArray = categoriesArray.concat(children);
      recurse(children);
    }
  };
  getChildren([category]);

  return categoriesArray;
};
Categories.helpers({getChildren: function () {return Categories.getChildren(this);}});

/**
 * @summary Get all of a post's categories
 * @param {Object} post
 */
Posts.getCategories = function (post) {
  return !!post.categories ? Categories.find({_id: {$in: post.categories}}).fetch() : [];
};
Posts.helpers({getCategories: function () {return Posts.getCategories(this);}});

/**
 * @summary Get a category's URL
 * @param {Object} category
 */
Categories.getUrl = function (category, isAbsolute) {
  isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
  const prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  // return prefix + FlowRouter.path("postsCategory", category);
  return `${prefix}/?cat=${category.slug}`;
};
Categories.helpers({getUrl: function () {return Categories.getUrl(this);}});

/**
 * @summary Get a category's counter name
 * @param {Object} category
 */
 Categories.getCounterName = function (category) {
  return category._id + "-postsCount";
 }
 Categories.helpers({getCounterName: function () {return Categories.getCounterName(this);}});
