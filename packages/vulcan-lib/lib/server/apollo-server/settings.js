import { registerSetting } from '../../modules/settings.js';

registerSetting('apolloEngine.logLevel', 'INFO', 'Log level (one of INFO, DEBUG, WARN, ERROR');
registerSetting(
  'apolloTracing',
  Meteor.isDevelopment,
  'Tracing by Apollo. Default is true on development and false on prod',
  true
);
