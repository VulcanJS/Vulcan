import { addRoute } from 'meteor/vulcan:core';

//Only create route on dev mode, not production.
if (Meteor.isDevelopment) {
  addRoute({
    name: 'theme',
    path: '/theme',
    componentName: 'ThemeStyles',
  });
}
