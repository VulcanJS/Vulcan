import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Reducers, Middleware }from 'meteor/nova:core';

const configureStore = (client, initialState = {}, history) => createStore(
  // reducers
  combineReducers({...Reducers, apollo: client.reducer()}),
  //initial state
  initialState,
  // middlewares
  compose(
    applyMiddleware(...Middleware, client.middleware()/*, routerMiddleware(history)*/),
    typeof window !== "undefined" && window.devToolsExtension ? window.devToolsExtension() : f => f
  ),
);

export { configureStore };
