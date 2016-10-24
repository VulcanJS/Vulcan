import Categories from './collection.js'
import PublicationsUtils from 'meteor/utilities:smart-publications';

Categories.publishedFields = {};

/**
 * @summary Specify which fields should be published by the categories publication
 * @array Categories.publishedFields.list
 */
Categories.publishedFields.list = PublicationsUtils.arrayToFields([
  "name",
  "description",
  "order",
  "slug",
  "image",
  "parentId",
]);