/*

Categories parameter

*/

import { addCallback, getSetting, registerSetting, getFragment, runQuery } from 'meteor/vulcan:core';
import gql from 'graphql-tag';
import { Categories } from './collection.js';

registerSetting('forum.categoriesFilter', 'union', 'Display posts belonging to all (“intersection”) or at least one of (“union”) the selected categories');

// Category Posts Parameters
// Add a 'categories' property to terms which can be used to filter *all* existing Posts views. 
function PostsCategoryParameter(parameters, terms, apolloClient) {

  // get category slugs
  const cat = terms.cat || terms['cat[]'];
  const categoriesSlugs = Array.isArray(cat) ? cat : [cat];
  let allCategories = [];

  if (cat && cat.length) {

    // get all categories
    // note: specify all arguments, see https://github.com/apollographql/apollo-client/issues/2051
    const query = `
      query GetCategories($terms: JSON) {
        CategoriesList(terms: $terms) {
          _id
          slug
        }
      }
    `

    if (Meteor.isClient) {
      // get categories from Redux store
      allCategories = apolloClient.readQuery({
        query: gql`${query}`,
        variables: {terms: {limit: 0, itemsPerPage: 0}}
      }).CategoriesList;
    } else {
      // TODO: figure out how to make this async without messing up withList on the client
      // get categories through GraphQL API using runQuery
      // const results = await runQuery(query);
      // allCategories = results.data.CategoriesList;
      allCategories = Categories.find().fetch();
    }

    // get corresponding category ids
    const categoriesIds = _.pluck(_.filter(allCategories, category => _.contains(categoriesSlugs, category.slug)), '_id');

    const operator = getSetting('forum.categoriesFilter', 'union') === 'union' ? '$in' : '$all';

    // parameters.selector = Meteor.isClient ? {...parameters.selector, 'categories._id': {$in: categoriesIds}} : {...parameters.selector, categories: {[operator]: categoriesIds}};
    parameters.selector = {...parameters.selector, categories: {[operator]: categoriesIds}};
  }

  return parameters;
}

addCallback('posts.parameters', PostsCategoryParameter);
