import { addRoute, getDynamicComponent } from 'meteor/vulcan:lib';

addRoute([
  // {name: 'cheatsheet', path: '/cheatsheet', component: import('./components/Cheatsheet.jsx')},
  { name: 'debug', path: '/debug', componentName: 'DebugDashboard',  layoutName: 'AdminLayout' },
  { name: 'debugGroups', path: '/debug/groups', component: () => getDynamicComponent(import('../components/Groups.jsx')), layoutName: 'AdminLayout' },
  { name: 'debugSettings', path: '/debug/settings', componentName: 'Settings', layoutName: 'AdminLayout' },
  { name: 'debugCallbacks', path: '/debug/callbacks', componentName: 'Callbacks', layoutName: 'AdminLayout' },
  // {name: 'emails', path: '/emails', component: () => getDynamicComponent(import('./components/Emails.jsx'))},
  { name: 'debugEmails', path: '/debug/emails', componentName: 'Emails', layoutName: 'AdminLayout' },
  { name: 'debugRoutes', path: '/debug/routes', componentName: 'Routes', layoutName: 'AdminLayout' },
  { name: 'debugComponents', path: '/debug/components', componentName: 'Components', layoutName: 'AdminLayout' },
  { name: 'debugI18n', path: '/debug/i18n', componentName: 'I18n', layoutName: 'AdminLayout' },
]);
