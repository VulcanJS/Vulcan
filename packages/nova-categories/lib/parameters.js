import Categories from './collection.js';
import { addCallback } from 'meteor/nova:core';
import { getCategories } from './schema.js';

// Category Default Sorting by Ascending order (1, 2, 3..)
function CategoriesAscOrderSorting(parameters, terms) {
  parameters.options.sort = {order: 1};
  
  return parameters;
}

addCallback('categories.parameters', CategoriesAscOrderSorting);

// Category Posts Parameters
// Add a "categories" property to terms which can be used to filter *all* existing Posts views. 
function PostsCategoryParameter(parameters, terms, apolloClient) {

  const cat = terms.cat || terms["cat[]"];

  // filter by category if category slugs are provided
  if (cat) {

    let categoriesIds = [];
    let selector = {};
    let slugs;

    if (typeof cat === "string") { // cat is a string
      selector = {slug: cat};
      slugs = [cat];
    } else if (Array.isArray(cat)) { // cat is an array
      selector = {slug: {$in: cat}};
      slugs = cat;
    }

    // get all categories passed in terms
    const categories = !!apolloClient ? _.filter(getCategories(apolloClient), category => _.contains(slugs, category.slug) ) : Categories.find(selector).fetch();
    
    // for each category, add its ID and the IDs of its children to categoriesId array
    categories.forEach(function (category) {
      categoriesIds.push(category._id);
      categoriesIds = categoriesIds.concat(_.pluck(Categories.getChildren(category), "_id"));
    });

    parameters.selector = Meteor.isClient ? {'categories._id': {$in: categoriesIds}} : {categories: {$in: categoriesIds}};
  }
  
  return parameters;
}

addCallback("posts.parameters", PostsCategoryParameter);
