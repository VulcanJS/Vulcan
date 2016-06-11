import React from 'react';
import {mount} from 'react-mounter';
import { IndexRoute, Route } from 'react-router';
import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';
import { ListContainer, DocumentContainer } from "meteor/utilities:react-list-container";


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
    <Route      name="posts.single"   path="posts/:_id(/:slug)"  component={Telescope.components.PostsSingle} />
    <Route      name="users.single"   path="users/:slug"        component={Telescope.components.UsersSingle} />
    <Route      name="users.account"  path="account"           component={Telescope.components.UsersAccount} />
    <Route      name="users.edit"     path="users/:slug/edit"  component={Telescope.components.UsersAccount} />
  </Route>
);

ReactRouterSSR.Run(AppRoutes);