import Telescope, { Components, registerComponent } from 'meteor/nova:lib';

Telescope.routes.indexRoute = { name: 'posts.list', component: Components.PostsHome };

Telescope.routes.add([
  {name:'posts.daily',    path:'daily',                 component: Components.PostsDaily},
  {name:'posts.single',   path:'posts/:_id(/:slug)',    component: Components.PostsSingle},
  {name:'users.single',   path:'users/:slug',           component: Components.UsersSingle},
  {name:'users.account',  path:'account',               component: Components.UsersAccount},
  {name:'resetPassword',  path:'reset-password/:token', component: Components.UsersResetPassword},
  {name:'users.edit',     path:'users/:slug/edit',      component: Components.UsersAccount},
]);
