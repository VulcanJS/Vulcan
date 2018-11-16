import {
  populateComponentsApp,
  populateRoutesApp,
  initializeFragments
} from 'meteor/vulcan:lib';

Meteor.startup(() => {
  // init the application components and routes, including components & routes from 3rd-party packages
  initializeFragments();
  populateComponentsApp();
  populateRoutesApp();
});
