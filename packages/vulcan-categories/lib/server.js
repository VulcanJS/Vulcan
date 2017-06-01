import Categories, { getCategories, getCategoriesAsOptions, getCategoriesAsNestedOptions } from './modules.js';
import Posts from 'meteor/vulcan:posts';
import './server/load_categories.js';

Posts._ensureIndex({'categories': 1});

export { getCategories, getCategoriesAsOptions, getCategoriesAsNestedOptions };
export default Categories;
