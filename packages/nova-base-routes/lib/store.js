import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import ApolloClient from 'apollo-client';

import Telescope from 'meteor/nova:lib';
import { meteorClientConfig } from 'meteor/apollo';

// see https://github.com/apollostack/meteor-integration/blob/master/package.js#L15
// on one hand, a client-side function shouldn't exist server-side
// on the other hand, it breaks server-side rendering
const config = Meteor.isClient ? meteorClientConfig() : {}; // so, that feels weird.

const client = new ApolloClient(config);

const rootReducer = combineReducers({...Telescope.reducers, apollo: client.reducer()}); 

const store = createStore(
  // reducers
  rootReducer,
  // middlewares
  compose(
    applyMiddleware(client.middleware()),
    typeof window !== "undefined" && window.devToolsExtension ? window.devToolsExtension() : f => f
  ),
);

export { store, client };