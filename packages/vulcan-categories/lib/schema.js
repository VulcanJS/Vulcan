import { Utils } from 'meteor/vulcan:core';

export function getCategories (apolloClient) {

  // get the current data of the store
  const apolloData = apolloClient.store.getState().apollo.data;
  
  // filter these data based on their typename: we are interested in the categories data
  let categories = _.filter(apolloData, (object, key) => {
    return object.__typename === 'Category'
  });

  // order categories
  categories = _.sortBy(categories, cat => cat.order);
  
  return categories;
}

export function getCategoriesAsOptions (apolloClient) {
  // give the form component (here: checkboxgroup) exploitable data
  return getCategories(apolloClient).map(function (category) {
    return {
      value: category._id,
      label: category.name,
      // slug: category.slug, // note: it may be used to look up from prefilled props
    };
  });
}

export function getCategoriesAsNestedOptions (apolloClient) {
  // give the form component (here: checkboxgroup) exploitable data
  const formattedCategories = getCategories(apolloClient).map(function (category) {
    return {
      value: category._id,
      label: category.name,
      parentId: category.parentId,
      _id: category._id
      // slug: category.slug, // note: it may be used to look up from prefilled props
    };
  });
  const nestedCategories = Utils.unflatten(formattedCategories, {idProperty: '_id', parentIdProperty: 'parentId', childrenProperty: 'options'});
  return nestedCategories;
}

// category schema
const schema = {
  _id: {
    type: String,
    viewableBy: ['guests'],
    optional: true,
  },
  name: {
    type: String,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
  },
  description: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
    form: {
      rows: 3
    }
  },
  order: {
    type: Number,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
  },
  slug: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
  },
  image: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
  },
  parentId: {
    type: String,
    optional: true,
    control: "select",
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
    resolveAs: 'parent: Category',
    form: {
      options: formProps => getCategoriesAsOptions(formProps.client)
    }
  }
};

export default schema;
