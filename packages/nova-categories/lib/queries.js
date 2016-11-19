import Telescope from 'meteor/nova:lib';
import Categories from './collection.js';

Telescope.graphQL.addQuery(`
  categoriesList(offset: Int, limit: Int): [Category]
  categoriesListTotal: Int
  category(_id: String): Category
`);