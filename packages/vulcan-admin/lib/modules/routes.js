import { addRoute } from 'meteor/vulcan:core';

addRoute({ name: 'admin', path: '/admin', component: import('../components/AdminHome.jsx')});
