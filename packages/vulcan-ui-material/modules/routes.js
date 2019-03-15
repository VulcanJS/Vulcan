import { addRoute } from 'meteor/vulcan:core';


addRoute({
  name: 'theme',
  path: '/theme',
  componentName: 'ThemeStyles',
});
