import { browserHistory } from 'react-router';
import { compose } from 'redux';

import {
  createApolloClient,
  configureStore,
  addAction, getActions, addReducer, getReducers, addMiddleware, getMiddlewares,
  Utils,
} from '../modules/index.js';

// init
const history = browserHistory;
const loginToken = global.localStorage['Meteor.loginToken'];
const apolloClient = createApolloClient();
addReducer({ apollo: apolloClient.reducer() });
addMiddleware(apolloClient.middleware());

// init context
const context = {
  history,
  loginToken,
  apolloClient,
  addAction, // context.addAction same as addAction
  getActions, // context.getActions same as getActions
  addReducer, // context.addReducer same as addReducer
  getReducers, // context.getReducers same as getReducers
  addMiddleware, // context.addMiddleware same as addMiddleware
  getMiddlewares, // context.getMiddlewares same as getMiddlewares
};

// init store
context.store = configureStore(context.getReducers, {}, (store) => {
  let chain, newDispatch;
  return next => (action) => {
    if (!chain) {
      chain = context.getMiddlewares().map(middleware => middleware(store));
      newDispatch = compose(...chain)(next)
    }
    return newDispatch(action);
  };
})

// render context object
export const renderContext = { get: () => context };

// render context get function
export const getRenderContext = () => renderContext.get();

// withRenderContext make it easy to access context
export const withRenderContext = (func) => {
  func(context);
};
