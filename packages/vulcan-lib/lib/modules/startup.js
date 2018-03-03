import { runCallbacks } from './callbacks';

Meteor.startup(() => {
  runCallbacks('app.startup');
});