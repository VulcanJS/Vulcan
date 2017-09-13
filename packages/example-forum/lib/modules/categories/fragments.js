import { registerFragment } from 'meteor/vulcan:core';

// note: fragment used by default on CategoriesList & PostsList fragments
registerFragment(`
  fragment CategoriesMinimumInfo on Category {
    # vulcan:categories
    _id
    name
    slug
  }
`);

registerFragment(`
  fragment CategoriesList on Category {
    # vulcan:categories
    ...CategoriesMinimumInfo
    description
    order
    image
    parentId
    parent {
      ...CategoriesMinimumInfo
    }
  }
`);
