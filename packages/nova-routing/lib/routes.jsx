import Telescope from 'meteor/nova:lib';
import React from 'react';
import { Messages } from 'meteor/nova:core';
import { IndexRoute, Route } from 'react-router';
import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';
import Helmet from 'react-helmet';
import Cookie from 'react-cookie';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import {getDataFromTree} from "react-apollo/server";
import { meteorClientConfig } from 'meteor/nova:apollo';
import { configureStore } from "./store.js";

Meteor.startup(function initNovaRoutesAndApollo() {

  Telescope.routes.add({name:"app.notfound", path:"*", component:Telescope.components.Error404});

  const AppRoutes = {
    path: '/',
    component: Telescope.components.App,
    indexRoute: Telescope.routes.indexRoute,
    childRoutes: Telescope.routes.routes
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
      client = new ApolloClient(meteorClientConfig({cookieLoginToken: loginToken}));

      store = configureStore(client, initialState, history);

      return <ApolloProvider store={store} client={client}>{app}</ApolloProvider>
    },
    props: {
      onUpdate: () => {
        Telescope.callbacks.run('router.onUpdate');
        // clear all previous messages
        store.dispatch(Telescope.actions.messages.clearSeen());
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
      //Cookie.plugToRequest(req, res);
      //console.log('preRender hook', app);
      // console.log(req.cookies);
      return Promise.await(getDataFromTree(app));
    },
    dehydrateHook: () => {
      // console.log(client.store.getState());
      const state = client.store.getState();
      
      // https://github.com/apollostack/apollo-client/issues/845
      delete state.apollo.queries;
      delete state.apollo.mutations;

      return client.store.getState();
    },
    // fetchDataHook: (components) => components,
  };
  
  ReactRouterSSR.Run(AppRoutes, clientOptions, serverOptions);
});