import { addRoute, replaceComponent } from 'meteor/vulcan:core';

import Layout from '../components/common/Layout.jsx';
import CategoriesPage from '../components/categories/CategoriesPage.jsx';

replaceComponent('Layout', Layout);

addRoute({ name: 'categories', path: '/', component: CategoriesPage });
