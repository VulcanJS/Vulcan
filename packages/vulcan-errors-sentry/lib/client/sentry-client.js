import { getSetting } from 'meteor/vulcan:core';
import { addInitFunction, addLogFunction, addUserFunction } from 'meteor/vulcan:errors';
import Sentry from '@sentry/browser';
import { clientDSNSetting } from '../modules/settings';
import { getUserObject } from '../modules/sentry';

const clientDSN = getSetting(clientDSNSetting);
const environment = getSetting('environment');

/*

Initialize Sentry

*/
function initSentryForClient(props = {}) {
  Sentry.init({
    dsn: clientDSN,
    environment,
    release: props.siteData && props.siteData.sourceVersion
  });
}
addInitFunction(initSentryForClient);

/*

Log an error, and optionally set current user as well

*/
function logToSentry({ error, details, currentUser }) {
  Sentry.withScope(scope => {
    if (currentUser) {
      scope.setUser(getUserObject(currentUser));
    }
    Object.keys(details).forEach(key => {
      scope.setExtra(key, details[key]);
    });
    Sentry.captureException(error);
  });
}
addLogFunction(logToSentry);

/*

Set the current user

*/
function setSentryUser({ user }) {
  Sentry.configureScope(scope => {
    scope.setUser(getUserObject(user));
  });
}
addUserFunction(setSentryUser);
