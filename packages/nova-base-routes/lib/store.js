import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import ApolloClient from 'apollo-client';
import { routerMiddleware } from 'react-router-redux'

import Telescope from 'meteor/nova:lib';
import { client } from 'meteor/nova:apollo';

const rootReducer = combineReducers({...Telescope.reducers, apollo: client.reducer()}); 

const configureStore = (initialState = {}, history) => createStore(
  // reducers
  rootReducer,
  //initial state
  initialState,
  // middlewares
  compose(
    applyMiddleware(client.middleware(), routerMiddleware(history)),
    typeof window !== "undefined" && window.devToolsExtension ? window.devToolsExtension() : f => f
  ),
);

export { configureStore };