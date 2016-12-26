import Telescope from './config.js';

import './utils.js';
import './callbacks.js';
import './settings.js';
import './collections.js';
import './deep.js';
import './deep_extend.js';
import './intl-polyfill.js';
import './graphql.js';
import './icons.js';

export { Components, registerComponent, replaceComponent, getRawComponent, getComponent, copyHoCs } from './components.js';
export { createCollection } from './collections.js';
export { Callbacks, addCallback, removeCallback, runCallbacks, runCallbacksAsync } from './callbacks.js';
export { GraphQLSchema } from './graphql.js';
export { Routes, addRoute } from './routes.js';
export { Utils } from './utils.js';
export { getSetting } from './settings.js';
export { Strings, addStrings } from './strings.js';
export { Actions, Reducers, Middleware } from './redux.js';
export { Headtags } from './headtags.js';

export default Telescope;
