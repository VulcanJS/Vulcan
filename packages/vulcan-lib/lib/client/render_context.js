import { browserHistory } from 'react-router';
import { compose } from 'redux';

import {
  createApolloClient,
  configureStore,
  addAction, getActions, addReducer, getReducers, addMiddleware, getMiddlewares,
} from '../modules/index.js';

let context;

export const initContext = () => {

  // init
  const history = browserHistory;
  const loginToken = global.localStorage['Meteor.loginToken'];
  let apolloClient;

  // init context
  context = {
    history,
    loginToken,
    addAction, // context.addAction same as addAction
    getActions, // context.getActions same as getActions
    addReducer, // context.addReducer same as addReducer
    getReducers, // context.getReducers same as getReducers
    addMiddleware, // context.addMiddleware same as addMiddleware
    getMiddlewares, // context.getMiddlewares same as getMiddlewares
  };

  // defer creation of apolloClient until it is first used
  Object.defineProperty(context, 'apolloClient', {
    enumerable: true,
    get: () => {
      if (!apolloClient) {
        apolloClient = createApolloClient();
        addReducer({ apollo: apolloClient.reducer() });
        addMiddleware(apolloClient.middleware());
      }
      return apolloClient;
    },
  });

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
}

// render context object
export const renderContext = { 
  get: () => {

    if (typeof context === 'undefined') {
      initContext();
    }

    return context

  } 
};

// render context get function
export const getRenderContext = () => renderContext.get();

// withRenderContext make it easy to access context
export const withRenderContext = (func) => {
  func(context);
};
