import { getSetting, getSourceVersion } from 'meteor/vulcan:core';
import { addInitFunction, addLogFunction, addUserFunction } from 'meteor/vulcan:errors';
import { serverDSNSetting } from '../modules/settings';
import Sentry from '@sentry/node';
import { getUserObject } from '../modules/sentry';

const serverDSN = getSetting(serverDSNSetting);
const environment = getSetting('environment');

/*

Initialize Sentry

*/
function initSentryForServer() {
  Sentry.init({
    dsn: serverDSN,
    environment,
    // see https://github.com/zodern/meteor-up/issues/807#issuecomment-346915622
    release: getSourceVersion(),
  });
}
addInitFunction(initSentryForServer);

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
function setSentryUser(currentUser) {
  Sentry.configureScope(scope => {
    scope.setUser(getUserObject(currentUser));
  });
}
addUserFunction(setSentryUser);
