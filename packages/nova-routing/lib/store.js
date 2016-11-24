import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
// import { routerMiddleware } from 'react-router-redux'

import Telescope from 'meteor/nova:lib';
// import { client } from 'meteor/nova:apollo';

const configureStore = (client, initialState = {}, history) => createStore(
  // reducers
  combineReducers({...Telescope.reducers, apollo: client.reducer()}),
  //initial state
  initialState,
  // middlewares
  compose(
    applyMiddleware(client.middleware()/*, routerMiddleware(history)*/),
    typeof window !== "undefined" && window.devToolsExtension ? window.devToolsExtension() : f => f
  ),
);

export { configureStore };