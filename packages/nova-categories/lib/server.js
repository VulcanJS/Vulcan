import Categories, { getCategories, getCategoriesAsOptions } from './modules.js';
import Posts from 'meteor/nova:posts';
import './server/load_categories.js';

Posts._ensureIndex({'categories': 1});

export { getCategories, getCategoriesAsOptions };
export default Categories;
