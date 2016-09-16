import Telescope from 'meteor/nova:lib';
import React from 'react';
import {mount} from 'react-mounter';
import { Messages } from 'meteor/nova:core';
import { IndexRoute, Route, useRouterHistory, browserHistory, createMemoryHistory } from 'react-router';
import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';
import { ListContainer, DocumentContainer } from "meteor/utilities:react-list-container";
// import useNamedRoutes from 'use-named-routes';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import Events from "meteor/nova:events";
import Helmet from 'react-helmet';
import Cookie from 'react-cookie';
import ReactDOM from 'react-dom';

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

  const AppRoutes = {
    path: '/',
    component: Telescope.components.App,
    indexRoute: Telescope.routes.indexRoute,
    childRoutes: Telescope.routes.routes
  }

  let history;

  const clientOptions = {
    renderHook: ReactDOM.render,
    props: {
      onUpdate: () => {
        Events.analyticsRequest(); 
        Messages.clearSeen();
      }
    }
  };

  const serverOptions = {
    htmlHook: (html) => {
      const head = Helmet.rewind();
      return html.replace('<head>', '<head>'+ head.title + head.meta + head.link);    
    },
    preRender: (req, res) => {
      Cookie.plugToRequest(req, res);
    },
  };
  
  ReactRouterSSR.Run(AppRoutes, clientOptions, serverOptions);
  
  // note: we did like this at first
  // if (Meteor.isClient) {
  //   history = useNamedRoutes(useRouterHistory(createBrowserHistory))({ routes: AppRoutes });
  // }
  // if (Meteor.isServer) {
  //   history = useNamedRoutes(useRouterHistory(createMemoryHistory))({ routes: AppRoutes });
  // }
  // ReactRouterSSR.Run(AppRoutes, {historyHook: () => history}, {historyHook: () => history});

});