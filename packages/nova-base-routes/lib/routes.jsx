import Telescope from 'meteor/nova:lib';
import React from 'react';
import { Messages } from 'meteor/nova:core';
import { IndexRoute, Route, useRouterHistory, browserHistory, createMemoryHistory } from 'react-router';
import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import Events from "meteor/nova:events";
import Helmet from 'react-helmet';
import Cookie from 'react-cookie';
import ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';
import { client } from 'meteor/nova:base-apollo';
import { store } from "./store.js";

Telescope.routes.indexRoute = { name: "posts.list", component: Telescope.components.PostsHome };

Meteor.startup(() => {

  Telescope.routes.add([
    {name:"posts.daily",    path:"daily",              component:Telescope.components.PostsDaily},
    {name:"posts.single",   path:"posts/:_id(/:slug)", component:Telescope.components.PostsSingle},
    {name:"users.single",   path:"users/:slug",        component:Telescope.components.UsersSingle},
    {name:"users.account",  path:"account",            component:Telescope.components.UsersAccount},
    {name:"users.edit",     path:"users/:slug/edit",   component:Telescope.components.UsersAccount},
    {name:"app.notfound",   path:"*",                  component:Telescope.components.Error404},
  ]);
  
  const ProvidedApp = (props) => (
    <ApolloProvider store={store} client={client}>
      <Telescope.components.AppContainer {...props} />
    </ApolloProvider>
  );

  const AppRoutes = {
    path: '/',
    component: ProvidedApp,
    indexRoute: Telescope.routes.indexRoute,
    childRoutes: Telescope.routes.routes
  };


  const clientOptions = {
    renderHook: ReactDOM.render,
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
    // see https://github.com/thereactivestack/meteor-react-router-ssr/blob/9762f12c5d5512c5cfee8663a29428f7e4c141f8/lib/server.jsx#L241-L257
    fetchDataHook: (components) => {
      console.log('this is where ssr & apollo should interact')
      return [new Promise((resolve, reject) => {
        resolve();
      })];
    },
  };
  
  ReactRouterSSR.Run(AppRoutes, clientOptions, serverOptions);
  
  // note: we did like this at first
  // let history;
  // if (Meteor.isClient) {
  //   history = useNamedRoutes(useRouterHistory(createBrowserHistory))({ routes: AppRoutes });
  // }
  // if (Meteor.isServer) {
  //   history = useNamedRoutes(useRouterHistory(createMemoryHistory))({ routes: AppRoutes });
  // }
  // ReactRouterSSR.Run(AppRoutes, {historyHook: () => history}, {historyHook: () => history});

});