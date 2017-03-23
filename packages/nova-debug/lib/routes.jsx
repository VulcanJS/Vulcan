import { addRoute, getComponent } from 'meteor/vulcan:core';

addRoute([
  {name: "cheatsheet", path: "/cheatsheet", component: getComponent("Cheatsheet")},
  {name: "groups", path: "/groups", component: getComponent("Groups")},
  {name: "settings", path: "/settings", component: getComponent("Settings")},
  {name: "emails", path: "/emails", component: getComponent("Emails")},
]);
