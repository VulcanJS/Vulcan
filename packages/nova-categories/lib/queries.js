import Telescope from 'meteor/nova:lib';
import Categories from './collection.js';

Telescope.graphQL.addQuery(`
  categories: [Category]
  category(_id: String): Category
`);

Categories.graphQLQueries = {
  single: `
    _id
    name
    description
    order
    slug
    image
    parent {
      _id
      name
      description
      order
      slug
      image
    }
  `
}