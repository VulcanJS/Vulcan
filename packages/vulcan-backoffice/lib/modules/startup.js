/**
 * Generate the backoffice on startup
 */
import {getSetting, Collections} from 'meteor/vulcan:core';
import setupBackoffice from './setupBackoffice';
import {devOptions} from './options';
import {addCallback} from 'meteor/vulcan:lib';

const enabled = getSetting('backoffice.enabled', Meteor.isDevelopment);

if (enabled) {
  const options = Meteor.isDevelopment ? devOptions : undefined; // loose permissions during development
  // setupBackoffice must be run before routes and components are populated
  // but after startup so that Collections are available
  addCallback('populate.before', function _setupBackoffice() {
    setupBackoffice(Collections, options);
  });
}
