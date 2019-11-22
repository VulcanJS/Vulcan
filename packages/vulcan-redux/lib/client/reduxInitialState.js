import { runCallbacks } from 'meteor/vulcan:lib';
import setupRedux from './setupRedux';

Meteor.startup(() => {
  const initialState = runCallbacks({name: 'redux.initialState', item: {}});
  setupRedux(initialState);
});