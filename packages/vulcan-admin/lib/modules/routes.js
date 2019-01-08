import {addRoute, getDynamicComponent} from 'meteor/vulcan:core';
import React from 'react';

addRoute({
  name: 'admin',
  path: '/admin',
  component: () => getDynamicComponent(import('../components/AdminHome.jsx')),
  layoutName: 'AdminLayout',
});
addRoute({
  name: 'admin2',
  path: '/admin/users',
  component: () => getDynamicComponent(import('../components/AdminHome.jsx')),
});
