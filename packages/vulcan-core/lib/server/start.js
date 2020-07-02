import { SyncedCron } from 'meteor/littledata:synced-cron';
import { getSetting, registerSetting } from 'meteor/vulcan:lib';

registerSetting('mailUrl', null, 'The SMTP URL used to send out email');

if (getSetting('mailUrl')) {
  process.env.MAIL_URL = getSetting('mailUrl');
}

Meteor.startup(function() {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-undef
    Vulcan.getGraphQLSchema();
  }
  if (typeof SyncedCron !== 'undefined') {
    SyncedCron.start();
  }
});
