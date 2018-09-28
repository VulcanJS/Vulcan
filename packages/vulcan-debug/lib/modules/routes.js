import { addRoute, getDynamicComponent } from 'meteor/vulcan:lib';

addRoute([
  // {name: 'cheatsheet', path: '/cheatsheet', component: import('./components/Cheatsheet.jsx')},
  {name: 'groups', path: '/groups', component: () => getDynamicComponent(import('../components/Groups.jsx')), layoutName: 'AdminLayout'},
  {name: 'settings', path: '/settings', componentName: 'Settings', layoutName: 'AdminLayout'},
  {name: 'callbacks', path: '/callbacks', componentName: 'Callbacks', layoutName: 'AdminLayout'},
  // {name: 'emails', path: '/emails', component: () => getDynamicComponent(import('./components/Emails.jsx'))},
  {name: 'emails', path: '/emails', componentName: 'Emails', layoutName: 'AdminLayout'},
  {name: 'routes', path: '/routes', componentName: 'Routes', layoutName: 'AdminLayout'},
  {name: 'components', path: '/components', componentName: 'Components', layoutName: 'AdminLayout'},
  {name: 'I18n', path: '/i18n', componentName: 'I18n', layoutName: 'AdminLayout'},
]);
