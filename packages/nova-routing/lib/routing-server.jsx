import React from 'react';
import Helmet from 'react-helmet';
import Cookie from 'react-cookie';
import ApolloClient from 'apollo-client';
import { getDataFromTree, ApolloProvider } from 'react-apollo';

import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';

import { meteorClientConfig } from 'meteor/nova:apollo';
import { Components, populateComponentsApp, addRoute, Routes, populateRoutesApp, configureStore, getReducers, getMiddleware } from 'meteor/nova:core';

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
    Hooks server side definition
  */

  const serverOptions = {
    historyHook(req, res, newHistory) {
      // Use history hook to get a reference to the history object
      req.history = newHistory
      return req.history;
    },
    wrapperHook(req, res, app, loginToken) {
      // console.log('wrapper hook');

      // configure apollo
      req.client = new ApolloClient(meteorClientConfig({ cookieLoginToken: loginToken }));
      const reducers = { ...getReducers(), apollo: req.client.reducer() };
      const middleware = [...getMiddleware(), req.client.middleware()];

      // configure the redux store
      req.store = configureStore(reducers, {}, middleware);

      return <ApolloProvider store={req.store} client={req.client}>{app}</ApolloProvider>
    },
    preRender(req, res, app) {
      Cookie.plugToRequest(req, res);
      //console.log('preRender hook', app);
      // console.log(req.cookies);
      return Promise.await(getDataFromTree(app));
    },
    dehydrateHook(req, res) {
      // console.log(client.store.getState());
      return req.client.store.getState();
    },
    postRender(req, res) {
      // console.log('postrender hook');
    },
    htmlHook(html) {
      const head = Helmet.rewind();
      return html.replace('<head>', '<head>'+ head.title + head.meta + head.link);
    },
  };

  ReactRouterSSR.Run(AppRoutes, {}, serverOptions);
});
