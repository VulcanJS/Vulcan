import Telescope from 'meteor/nova:lib';

Telescope.routes.indexRoute = { name: 'posts.list', component: Telescope.components.PostsHome };

Telescope.routes.add([
  {name:'posts.daily',    path:'daily',                 component: Telescope.components.PostsDaily},
  {name:'posts.single',   path:'posts/:_id(/:slug)',    component: Telescope.components.PostsSingle},
  {name:'users.single',   path:'users/:slug',           component: Telescope.components.UsersSingle},
  {name:'users.account',  path:'account',               component: Telescope.components.UsersAccount},
  {name:'resetPassword',  path:'reset-password/:token', component: Telescope.components.UsersResetPassword},
  {name:'users.edit',     path:'users/:slug/edit',      component: Telescope.components.UsersAccount},
]);
