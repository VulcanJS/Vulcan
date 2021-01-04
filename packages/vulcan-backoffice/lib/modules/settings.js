import { registerSetting } from 'meteor/vulcan:core';
registerSetting('backoffice.enable', Meteor.isDevelopment, 'Automatically generate a backoffice', true);
