import Posts from './collection.js';

import './schema.js';
import './custom_fields.js';
import './parameters.js';
import './views.js';
import './helpers.js';
import './callbacks/callbacks_posts_new.js';
import './callbacks/callbacks_posts_edit.js';
import './callbacks/callbacks_other.js';
import './permissions.js';
import './resolvers.js';
import './mutations.js';
import './redux.js';
import './i18n.js';
import './admin.js';

export { default as AdminUsersPosts } from './components/AdminUsersPosts';
export default Posts;