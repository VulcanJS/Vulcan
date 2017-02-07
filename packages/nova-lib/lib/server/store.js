import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

export const configureStore = (reducers, initialState = {}, middlewares) => createStore(
  // reducers
  combineReducers(reducers),
  // initial state
  initialState,
  // middlewares
  compose(
    applyMiddleware(...middlewares),
  ),
);
