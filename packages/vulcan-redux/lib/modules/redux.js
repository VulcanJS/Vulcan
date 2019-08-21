import { createStore, applyMiddleware, combineReducers } from 'redux';
import compose from 'recompose/compose';
import _isEmpty from 'lodash/isEmpty';
// TODO: now we should add some callback call to add the store to
// Apollo SSR + client side too

// create store, and implement reload function
export const configureStore = (
  reducers = getReducers,
  initialState = {},
  middlewares = getMiddlewares
) => {
  let getReducers;
  if (typeof reducers === 'function') {
    getReducers = reducers;
    reducers = getReducers();
  }
  if (typeof reducers === 'object') {
    // allow to tolerate empty reducers
    //@see https://github.com/reduxjs/redux/issues/968
    reducers = !_isEmpty(reducers) ? combineReducers(reducers) : () => {};
  }
  let getMiddlewares;
  if (typeof middlewares === 'function') {
    getMiddlewares = middlewares;
    middlewares = getMiddlewares();
  }
  middlewares = Array.isArray(middlewares) ? middlewares : [middlewares];
  const store = createStore(
    // reducers
    reducers,
    // initial state
    initialState,
    // middlewares
    compose(
      applyMiddleware(...middlewares),
      typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : f => f
    )
  );
  store.reload = function reload(options = {}) {
    if (typeof options.reducers === 'function') {
      getReducers = options.reducers;
      options.reducers = undefined;
    }
    if (!options.reducers && getReducers) {
      options.reducers = getReducers();
    }
    if (options.reducers) {
      reducers =
        typeof options.reducers === 'object' ? combineReducers(options.reducers) : options.reducers;
    }
    this.replaceReducer(reducers);
    return store;
  };
  return store;
};

// action
// **Notes: client side, addAction to browser**
// **Notes: server side, addAction to server share with every req**
let actions = {};
export const addAction = addedAction => {
  actions = { ...actions, ...addedAction };
  return actions;
};
export const getActions = () => actions;
// reducers
// **Notes: client side, addReducer to browser**
// **Notes: server side, addReducer to server share with every req**
let reducers = {};

export const addReducer = addedReducer => {
  reducers = { ...reducers, ...addedReducer };
  return reducers;
};
export const getReducers = () => reducers;
// middlewares
// **Notes: client side, addMiddleware to browser**
// **Notes: server side, addMiddleware to server share with every req**
let middlewares = [];

export const addMiddleware = (middlewareOrMiddlewareArray, options = {}) => {
  const addedMiddleware = Array.isArray(middlewareOrMiddlewareArray)
    ? middlewareOrMiddlewareArray
    : [middlewareOrMiddlewareArray];
  if (options.unshift) {
    middlewares = [...addedMiddleware, ...middlewares];
  } else {
    middlewares = [...middlewares, ...addedMiddleware];
  }
  return middlewares;
};
export const getMiddlewares = () => middlewares;

let store;
export const initStore = () => {
  if (!store) {
    store = configureStore();
  }
  return store;
};
export const getStore = () => store;
