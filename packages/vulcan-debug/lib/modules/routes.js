import { addRoute, getDynamicComponent } from 'meteor/vulcan:lib';

addRoute([
  // {name: 'cheatsheet', path: '/cheatsheet', component: import('./components/Cheatsheet.jsx')},
  {name: 'groups', path: '/groups', component: () => getDynamicComponent(import('../components/Groups.jsx'))},
  {name: 'settings', path: '/settings', componentName: 'Settings'},
  // {name: 'emails', path: '/emails', component: () => getDynamicComponent(import('./components/Emails.jsx'))},
  {name: 'emails', path: '/emails', componentName: 'Emails'},
]);