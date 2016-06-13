import React from 'react';
import {mount} from 'react-mounter';

import { IndexRoute, Route, useRouterHistory, browserHistory, createMemoryHistory } from 'react-router';
import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';
import { ListContainer, DocumentContainer } from "meteor/utilities:react-list-container";
import useNamedRoutes from 'use-named-routes';
import createBrowserHistory from 'history/lib/createBrowserHistory';

// // ------------------------------------- Other -------------------------------- //

// FlowRouter.notFound = {
//   action() {
//     ({App, Error404} = Telescope.components);
//     mount(App, {content: <Error404/>});
//   }
// };

const AppRoutes = (
  <Route path="/" component={Telescope.components.App} >
    <IndexRoute name="posts.list"                               component={Telescope.components.PostsHome} />
    <Route      name="posts.daily"    path="daily"              component={Telescope.components.PostsDaily} />
    <Route      name="posts.single"   path="posts/:_id(/:slug)" component={Telescope.components.PostsSingle} />
    <Route      name="users.single"   path="users/:slug"        component={Telescope.components.UsersSingle} />
    <Route      name="users.account"  path="account"            component={Telescope.components.UsersAccount} />
    <Route      name="users.edit"     path="users/:slug/edit"   component={Telescope.components.UsersAccount} />
  </Route>
);

let history;

if (Meteor.isClient) {
  history = useNamedRoutes(useRouterHistory(createBrowserHistory))({ routes: AppRoutes });
}

if (Meteor.isServer) {
  history = useNamedRoutes(useRouterHistory(createMemoryHistory))({ routes: AppRoutes });
}

// ReactRouterSSR.Run(AppRoutes, {historyHook: () => history}, {historyHook: () => history});
ReactRouterSSR.Run(AppRoutes);
