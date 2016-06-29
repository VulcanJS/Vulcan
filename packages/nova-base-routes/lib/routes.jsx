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

// // ------------------------------------- Other -------------------------------- //

// FlowRouter.notFound = {
//   action() {
//     ({App, Error404} = Telescope.components);
//     mount(App, {content: <Error404/>});
//   }
// };

Meteor.startup(() => {

  Telescope.routes.add([
    {name:"posts.daily",    path:"daily",              component:Telescope.components.PostsDaily},
    {name:"posts.single",   path:"posts/:_id(/:slug)", component:Telescope.components.PostsSingle},
    {name:"users.single",   path:"users/:slug",        component:Telescope.components.UsersSingle},
    {name:"users.account",  path:"account",            component:Telescope.components.UsersAccount},
    {name:"users.edit",     path:"users/:slug/edit",   component:Telescope.components.UsersAccount}
  ]);

  const AppRoutes = {
    path: '/',
    component: Telescope.components.App,
    indexRoute: { name: "posts.list", component: Telescope.components.PostsHome },
    childRoutes: Telescope.routes.routes
  }

  let history;

  const clientOptions = {}, serverOptions = {};

  // if (Meteor.isClient) {
  //   history = useNamedRoutes(useRouterHistory(createBrowserHistory))({ routes: AppRoutes });
  // }

  // if (Meteor.isServer) {
  //   history = useNamedRoutes(useRouterHistory(createMemoryHistory))({ routes: AppRoutes });
  // }

  clientOptions.props = {onUpdate: () => {Events.analyticsRequest(); Messages.clearSeen();}};

  serverOptions.htmlHook = (html) => {
    const head = Helmet.rewind();
    return html.replace('<head>', '<head>'+ head.title + head.meta + head.link);    
  }
  
  // ReactRouterSSR.Run(AppRoutes, {historyHook: () => history}, {historyHook: () => history});
  ReactRouterSSR.Run(AppRoutes, clientOptions, serverOptions);

});