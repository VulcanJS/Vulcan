import { addRoute } from 'meteor/nova:core';

addRoute([
  {name: "cheatsheet", path: "/cheatsheet", componentName: "Cheatsheet"},
  {name: "groups", path: "/groups", componentName: "Groups"},
  {name: "settings", path: "/settings", componentName: "Settings"},
  {name: "emails", path: "/emails", componentName: "Emails"},
]);
