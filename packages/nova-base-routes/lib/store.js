import { createStore, compose, combineReducers, } from 'redux';
import Telescope from 'meteor/nova:lib';

const rootReducer = combineReducers(Telescope.reducers); 

const defaultState = {
  messages: [],
};

const enhancers = compose(
  typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
);

const store = createStore(rootReducer, defaultState);

export default store;