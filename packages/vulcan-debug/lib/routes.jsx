import { addRoute, getDynamicComponent } from 'meteor/vulcan:core';

addRoute([
  // {name: "cheatsheet", path: "/cheatsheet", component: import('./components/Cheatsheet.jsx')},
  {name: "groups", path: "/groups", component: () => getDynamicComponent(import('./components/Groups.jsx'))},
  {name: "settings", path: "/settings", component: () => getDynamicComponent(import('./components/Settings.jsx'))},
  {name: "emails", path: "/emails", component: () => getDynamicComponent(import('./components/Emails.jsx'))},
]);