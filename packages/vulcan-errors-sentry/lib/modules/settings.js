import { registerSetting } from 'meteor/vulcan:core';

export const clientDSNSetting = 'sentry.clientDSN';
export const serverDSNSetting = 'sentry.serverDSN';
export const tokensUrl = 'https://sentry.io/onboarding/{account}/{project}/configure/node';

registerSetting(clientDSNSetting, null, `Sentry client DSN access token (from ${tokensUrl})`);
registerSetting(serverDSNSetting, null, `Sentry client DSN access token (from ${tokensUrl})`);
