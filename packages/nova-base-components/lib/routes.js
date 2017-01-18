import { getComponent, addRoute } from 'meteor/nova:core';

addRoute([
  {name:'posts.list',     path: '/',                    component: getComponent('PostsHome')}, // index route
  {name:'posts.daily',    path:'daily',                 component: getComponent('PostsDaily')},
  {name:'posts.single',   path:'posts/:_id(/:slug)',    component: getComponent('PostsSingle')},
  {name:'users.single',   path:'users/:slug',           component: getComponent('UsersSingle')},
  {name:'users.account',  path:'account',               component: getComponent('UsersAccount')},
  {name:'resetPassword',  path:'reset-password/:token', component: getComponent('UsersResetPassword')},
  {name:'users.edit',     path:'users/:slug/edit',      component: getComponent('UsersAccount')},
]);
