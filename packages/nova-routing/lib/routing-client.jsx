import React from 'react';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { applyRouterMiddleware } from 'react-router';
import { useScroll } from 'react-router-scroll';

import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';

import { meteorClientConfig } from 'meteor/nova:apollo';
import { Components, populateComponentsApp, runCallbacks, addRoute, Routes, populateRoutesApp, configureStore, addReducer, addMiddleware } from 'meteor/nova:core';

Meteor.startup(function initNovaRoutesAndApollo() {

  // note: route defined here because it "shouldn't be removable"
  addRoute({name:"app.notfound", path:"*", componentName: 'Error404'});

  // uncomment for debug
  // console.log('// --> starting routing');

  // init the application components and routes, including components & routes from 3rd-party packages
  populateComponentsApp();
  populateRoutesApp();

  const indexRoute = _.filter(Routes, route => route.path === '/')[0];
  const childRoutes = _.reject(Routes, route => route.path === '/');
  delete indexRoute.path; // delete the '/' path to avoid warning

  const AppRoutes = {
    path: '/',
    component: Components.App,
    indexRoute,
    childRoutes,
  };

  /*
    Hooks client side definition
  */

  let history;
  let initialState;
  let store;
  let client;

  const clientOptions = {
    rehydrateHook: state => {
      // console.log('rehydrated state', state);
      initialState = state

      // configure apollo
      client = new ApolloClient(meteorClientConfig());
      const reducers = addReducer({apollo: client.reducer()});
      const middleware = addMiddleware(client.middleware());

      // configure the redux store
      store = configureStore(reducers, initialState, middleware);
    },
    historyHook(newHistory) {
      // Use history hook to get a reference to the history object
      history = newHistory
      return history;
    },
    props: {
      onUpdate: () => {
        // the first argument is an item to iterate on, needed by nova:lib/callbacks
        // note: this item is not used in this specific callback: router.onUpdate
        runCallbacks('router.onUpdate', {}, store, client);
      },
      render: applyRouterMiddleware(useScroll())
    },
    wrapperHook(app, loginToken) {
      // console.log('wrapper hook initial state', initialState);
      return <ApolloProvider store={store} client={client}>{app}</ApolloProvider>
    },
  };

  ReactRouterSSR.Run(AppRoutes, clientOptions, {});
});
