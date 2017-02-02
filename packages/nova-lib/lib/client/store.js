import { createStore, applyMiddleware, compose, combineReducers } from 'redux';

import { getMiddlewares, getReducers } from '../redux.js';

function mainMiddleware(store) {
  let chain;
  return (next) => (action) => {
    if (!chain || action.type === 'STORE_RELOADED' ) {
      chain = getMiddlewares().map(middleware => middleware(store));
    }
    return compose(...chain)(next)(action);
  }
}

export const store = createStore(s => s, {}, compose(
  applyMiddleware(mainMiddleware),
  typeof window !== "undefined" && window.devToolsExtension ? window.devToolsExtension() : f => f
));

store.reload = function reload(/* initialState = {} */) {
  // this.replaceReducer(() => initialState);
  const rootReducer = combineReducers(getReducers());
  this.replaceReducer(rootReducer);
  this.dispatch({ type: "STORE_RELOADED" });
};
