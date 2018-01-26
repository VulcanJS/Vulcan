/*

Categories schema

*/

import { Utils } from 'meteor/vulcan:core';

export function getCategoriesAsOptions (categories) {
  // give the form component (here: checkboxgroup) exploitable data
  return categories.map(category => ({
    value: category._id,
    label: category.name,
    // slug: category.slug, // note: it may be used to look up from prefilled props
  }));
}

export function getCategoriesAsNestedOptions (categories) {
  // give the form component (here: checkboxgroup) exploitable data
  const formattedCategories = categories.map(function (category) {
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
    onInsert: category => {
      // if no slug has been provided, generate one
      const slug = category.slug || Utils.slugify(category.name);
      return Utils.getUnusedSlugByCollectionName('Categories', slug);
    },
    onEdit: (modifier, category) => {
      // if slug is changing
      if (modifier.$set && modifier.$set.slug && modifier.$set.slug !== category.slug) {
        const slug = modifier.$set.slug;
        return Utils.getUnusedSlugByCollectionName('Categories', slug);
      }
    }
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
    resolveAs: {
      fieldName: 'parent',
      type: 'Category',
      resolver: async (category, args, {currentUser, Users, Categories}) => {
        if (!category.parentId) return null;
        const parent = await Categories.loader.load(category.parentId);
        return Users.restrictViewableFields(currentUser, Categories, parent);
      },
      addOriginalField: true
    },
    options: props => {
      return getCategoriesAsOptions(props.data.CategoriesList);
    },
    query: `
      CategoriesList{
        _id
        name
        slug
        order
      }
    `,
  }
};

export default schema;
