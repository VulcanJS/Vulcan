import { addRoute, getComponent } from 'meteor/vulcan:core';

addRoute([
  {name: "cheatsheet", path: "/cheatsheet", component: import('./components/Cheatsheet.jsx')},
  {name: "groups", path: "/groups", component: import('./components/Groups.jsx')},
  {name: "settings", path: "/settings", component: import('./components/Settings.jsx')},
  {name: "emails", path: "/emails", component: import('./components/Emails.jsx')},
]);
