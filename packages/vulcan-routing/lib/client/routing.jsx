import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { applyRouterMiddleware } from 'react-router';
import { useScroll } from 'react-router-scroll';

import { Meteor } from 'meteor/meteor';

import {
  Components,
  addRoute,
  addReducer, addMiddleware,
  Routes, populateComponentsApp, populateRoutesApp, runCallbacks,
  getRenderContext,
} from 'meteor/vulcan:lib';

import { RouterClient } from './router.jsx';

Meteor.startup(() => {
  // note: route defined here because it "shouldn't be removable"
  addRoute({name:"app.notfound", path:"*", componentName: 'Error404'});

  // init the application components and routes, including components & routes from 3rd-party packages
  populateComponentsApp();
  populateRoutesApp();

  const indexRoute = _.filter(Routes, route => route.path === '/')[0];
  const childRoutes = _.reject(Routes, route => route.path === '/');

  if (indexRoute) {
    delete indexRoute.path; // delete the '/' path to avoid warning
  }

  const AppRoutes = {
    path: '/',
    component: Components.App,
    indexRoute,
    childRoutes,
  };

  const options = {
    rehydrateHook(data) {
      const initialState = data;
      const context = getRenderContext();
      context.initialState = initialState;
      const apolloClientReducer = (state = {}, action) => {
        if (initialState && initialState.apollo && !_.isEmpty(initialState.apollo.data) && _.isEmpty(state.data)) {
          state = initialState.apollo
        }
        const newState = context.apolloClient.reducer()(state, action);
        return newState;
      }
      context.addReducer({ apollo: apolloClientReducer });
      context.store.reload();
      context.store.dispatch({ type: '@@nova/INIT' }) // the first dispatch will generate a newDispatch function from middleware
    },
    historyHook(newHistory) {
      const { history } = getRenderContext();
      return history;
    },
    wrapperHook(appGenerator) {
      const { apolloClient, store } = getRenderContext();
      const app = appGenerator({
        onUpdate: () => {
          // the first argument is an item to iterate on, needed by vulcan:lib/callbacks
          // note: this item is not used in this specific callback: router.onUpdate
          runCallbacks('router.onUpdate', {}, store, apolloClient);
        },
        render: applyRouterMiddleware(useScroll())
      });
      return <ApolloProvider store={store} client={apolloClient}>{app}</ApolloProvider>;
    },
  };

  RouterClient.run(AppRoutes, options);
});
