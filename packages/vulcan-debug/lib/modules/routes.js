import {addRoute, getDynamicComponent} from 'meteor/vulcan:lib';

addRoute([
  // {name: 'cheatsheet', path: '/cheatsheet', component: import('./components/Cheatsheet.jsx')},
  {
    name: 'debug',
    path: '/debug',
    componentName: 'DebugDashboard',
    layoutName: 'DebugLayout',
  },
  {
    name: 'debugGroups',
    path: '/debug/groups',
    component: () => getDynamicComponent(import('../components/Groups.jsx')),
    layoutName: 'DebugLayout',
  },
  {
    name: 'debugSettings',
    path: '/debug/settings',
    componentName: 'Settings',
    layoutName: 'DebugLayout',
  },
  {
    name: 'debugCallbacks',
    path: '/debug/callbacks',
    componentName: 'Callbacks',
    layoutName: 'DebugLayout',
  },
  // {name: 'emails', path: '/emails', component: () => getDynamicComponent(import('./components/Emails.jsx'))},
  {
    name: 'debugEmails',
    path: '/debug/emails',
    componentName: 'Emails',
    layoutName: 'DebugLayout',
  },
  {
    name: 'debugRoutes',
    path: '/debug/routes',
    componentName: 'Routes',
    layoutName: 'DebugLayout',
  },
  {
    name: 'debugComponents',
    path: '/debug/components',
    componentName: 'Components',
    layoutName: 'DebugLayout',
  },
  {
    name: 'debugI18n',
    path: '/debug/i18n',
    componentName: 'I18n',
    layoutName: 'DebugLayout',
  },
]);
