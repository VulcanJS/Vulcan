import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

export const configureStore = (reducers, initialState = {}, middleware) => createStore(
  // reducers 
  combineReducers(reducers),
  // initial state
  initialState,
  // middleware
  compose(
    applyMiddleware(...middleware),
    typeof window !== "undefined" && window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

export let Actions = {};
export const addAction = addedAction => {
  Actions = {...Actions, ...addedAction};
  
  return Actions;
};

export let Reducers = {};
export const addReducer = addedReducer => {
  Reducers = {...Reducers, ...addedReducer};
  
  return Reducers;
};

export let Middleware = [];
export const addMiddleware = middlewareOrMiddlewareArray => {
  const addedMiddleware = Array.isArray(middlewareOrMiddlewareArray) ? middlewareOrMiddlewareArray : [middlewareOrMiddlewareArray];
  
  Middleware = [...Middleware, ...addedMiddleware];
  
  return Middleware;
};
