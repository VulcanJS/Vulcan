import Telescope from './config.js';

import './utils.js';
import './callbacks.js';
import './settings.js';
import './collections.js';
import './deep.js';
import './deep_extend.js';
import './intl_polyfill.js';
import './graphql.js';
import './icons.js';
import './mongo_redux.js';

export { Components, registerComponent, replaceComponent, getRawComponent, getComponent, copyHoCs, populateComponentsApp } from './components.js';
export { createCollection } from './collections.js';
export { Callbacks, addCallback, removeCallback, runCallbacks, runCallbacksAsync } from './callbacks.js';
export { GraphQLSchema } from './graphql.js';
export { Routes, addRoute, getRoute, populateRoutesApp } from './routes.js';
export { Utils } from './utils.js';
export { getSetting } from './settings.js';
export { Strings, addStrings } from './strings.js';
export { configureStore, getActions, addAction, getReducers, addReducer, getMiddlewares, addMiddleware } from './redux.js';
export { Headtags } from './headtags.js';
export { Fragments, registerFragment, getFragment, getFragmentName, extendFragment } from './fragments.js';
export { createApolloClient } from './apollo.js';

export default Telescope;
