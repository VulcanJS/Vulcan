import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
// import { routerMiddleware } from 'react-router-redux'

import { Reducers, Middleware }from 'meteor/nova:lib';

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
