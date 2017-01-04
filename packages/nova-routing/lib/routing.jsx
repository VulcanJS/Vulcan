import { Components, Actions } from 'meteor/nova:lib';
import React from 'react';
import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';
import Helmet from 'react-helmet';
import Cookie from 'react-cookie';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { getDataFromTree, ApolloProvider } from 'react-apollo';
import { meteorClientConfig } from 'meteor/nova:apollo';
import { runCallbacks, addRoute, Routes, configureStore, addReducer, addMiddleware } from 'meteor/nova:core';

Meteor.startup(function initNovaRoutesAndApollo() {

  addRoute({name:"app.notfound", path:"*", component:Components.Error404});

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
    Hooks client side and server side definition
  */


  let history;
  let initialState;
  let store;
  let client;

  // Use history hook to get a reference to the history object
  const historyHook = newHistory => history = newHistory;

  const clientOptions = {
    historyHook,
    rehydrateHook: state => {
      // console.log('rehydrated state', state);
      initialState = state
    },
    wrapperHook(app, loginToken) {
      // console.log('wrapper hook initial state', initialState);
      // configure apollo
      client = new ApolloClient(meteorClientConfig({cookieLoginToken: loginToken}));
      const reducers = addReducer({apollo: client.reducer()});
      const middleware = addMiddleware(client.middleware());
      
      // configure the redux store
      store = configureStore(reducers, initialState, middleware);

      return <ApolloProvider store={store} client={client}>{app}</ApolloProvider>
    },
    props: {
      onUpdate: () => {
        runCallbacks('router.onUpdate');
        // clear all previous messages
        store.dispatch(Actions.messages.clearSeen());
      },
    },
  };

  const serverOptions = {
    historyHook,
    htmlHook: (html) => {
      const head = Helmet.rewind();
      return html.replace('<head>', '<head>'+ head.title + head.meta + head.link);
    },
    preRender: (req, res, app) => {
      Cookie.plugToRequest(req, res);
      //console.log('preRender hook', app);
      // console.log(req.cookies);
      return Promise.await(getDataFromTree(app));
    },
    dehydrateHook: () => {
      // console.log(client.store.getState());
      return client.store.getState();
    },
    // fetchDataHook: (components) => components,
  };

  ReactRouterSSR.Run(AppRoutes, clientOptions, serverOptions);
});
