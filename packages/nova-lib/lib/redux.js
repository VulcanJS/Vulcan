import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

export const configureStore = (reducers, initialState = {}, middlewares) => createStore(
  // reducers
  combineReducers(reducers),
  // initial state
  initialState,
  // middleware
  compose(
    applyMiddleware(...middlewares),
    typeof window !== "undefined" && window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

let actions = {};
export const addAction = addedAction => {
  actions = {...actions, ...addedAction};

  return actions;
};
export const getActions = () => actions;

let reducers = {};
export const addReducer = addedReducer => {
  reducers = {...reducers, ...addedReducer};

  return reducers;
};
export const getReducers = () => reducers;

let middlewares = [];
export const addMiddleware = middlewareOrMiddlewareArray => {
  const addedMiddleware = Array.isArray(middlewareOrMiddlewareArray) ? middlewareOrMiddlewareArray : [middlewareOrMiddlewareArray];

  middlewares = [...middlewares, ...addedMiddleware];

  return middlewares;
};
export const getMiddlewares = () => middlewares;
