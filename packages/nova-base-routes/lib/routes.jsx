import Telescope from 'meteor/nova:lib';
import React from 'react';
import { Messages } from 'meteor/nova:core';
import { IndexRoute, Route } from 'react-router';
import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';
import Events from "meteor/nova:events";
import Helmet from 'react-helmet';
import Cookie from 'react-cookie';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';
import { client } from 'meteor/nova:base-apollo';
import { configureStore } from "./store.js";


Meteor.startup(() => {
  
  /*
    Routes definition  
  */

  Telescope.routes.indexRoute = { name: "posts.list", component: Telescope.components.PostsHome };

  Telescope.routes.add([
    {name:"posts.daily",    path:"daily",              component:Telescope.components.PostsDaily},
    {name:"posts.single",   path:"posts/:_id(/:slug)", component:Telescope.components.PostsSingle},
    {name:"users.single",   path:"users/:slug",        component:Telescope.components.UsersSingle},
    {name:"users.account",  path:"account",            component:Telescope.components.UsersAccount},
    {name:"users.edit",     path:"users/:slug/edit",   component:Telescope.components.UsersAccount},
    {name:"app.notfound",   path:"*",                  component:Telescope.components.Error404},
  ]);

  const AppRoutes = {
    path: '/',
    component: Telescope.components.AppContainer,
    indexRoute: Telescope.routes.indexRoute,
    childRoutes: Telescope.routes.routes
  };

  /*
    Hooks client side and server side definition
  */

  
  let history;
  let initialState;
  let store;
  
  // Use history hook to get a reference to the history object
  const historyHook = newHistory => history = newHistory;

  // Pass the state of the store as the object to be dehydrated server side
  const dehydrateHook = () => {
    // console.log('store get state', store.getState());
    return store.getState();
  }

  // Take the rehydrated state and use it as the initial state client side
  const rehydrateHook = state => {
    // console.log('rehydrated state', state);
    initialState = state
  };

  const clientOptions = {
    historyHook,
    rehydrateHook,
    wrapperHook(app) {
      store = configureStore(initialState, history);
      return <ApolloProvider store={store} client={client}>{app}</ApolloProvider>
    },
    props: {
      onUpdate: () => {
        Events.analyticsRequest(); 
        // clear all previous messages
        store.dispatch(Telescope.actions.messages.clearSeen());
      },
    },
  };

  const serverOptions = {
    htmlHook: (html) => {
      const head = Helmet.rewind();
      return html.replace('<head>', '<head>'+ head.title + head.meta + head.link);    
    },
    preRender: (req, res) => {
      Cookie.plugToRequest(req, res);
    },
    historyHook,
    dehydrateHook,
    // see https://github.com/thereactivestack/meteor-react-router-ssr/blob/9762f12c5d5512c5cfee8663a29428f7e4c141f8/lib/server.jsx#L241-L257
    // note: can't get it working well
    // fetchDataHook: (components) => {
    //   console.log(components[0]); // = Apollo(AppContainer)
    //   // console.log('this is where ssr & apollo should interact -> fetch data')
    //   return [components[0].fetchData({} /* should be props .. how to get them?*/, {client})];
    // },
    fetchDataHook: (components) => components,
  };
  
  ReactRouterSSR.Run(AppRoutes, clientOptions, serverOptions);
});