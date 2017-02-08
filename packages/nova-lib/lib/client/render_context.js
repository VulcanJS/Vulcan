import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { browserHistory } from 'react-router';

import { createApolloClient, addReducer, addMiddleware, getReducers, getMiddlewares } from '../modules/index.js';

const history = browserHistory;

const loginToken = global.localStorage['Meteor.loginToken'];
const apolloClient = createApolloClient();

const reducers = addReducer({ apollo: apolloClient.reducer() });
const middlewares = addMiddleware(apolloClient.middleware());

const STORE_RELOADED = 'STORE_RELOADED';

function mainMiddleware(store) {
  let chain;
  return next => (action) => {
    if (!chain || action.type === STORE_RELOADED) {
      chain = getMiddlewares().map(middleware => middleware(store));
    }
    return compose(...chain)(next)(action);
  };
}

const store = createStore(s => s, {}, compose(
  applyMiddleware(mainMiddleware),
  typeof window !== 'undefined' && window.devToolsExtension ? window.devToolsExtension() : f => f,
));

store.reload = function reload() {
  const rootReducer = combineReducers(getReducers());
  this.replaceReducer(rootReducer);
  this.dispatch({ type: STORE_RELOADED });
};

const context = {
  history,
  loginToken,
  apolloClient,
  reducers,
  middlewares,
  store,
};

export const renderContext = {
  get() {
    return context;
  },
};

export const getRenderContext = () => renderContext.get();

export const withRenderContext = (func) => {
  func();
};
