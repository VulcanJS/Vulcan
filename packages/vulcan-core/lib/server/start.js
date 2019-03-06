import {Inject} from 'meteor/meteorhacks:inject-initial';
import { SyncedCron } from 'meteor/littledata:synced-cron';
import { getSetting, registerSetting } from 'meteor/vulcan:lib';

registerSetting('mailUrl', null, 'The SMTP URL used to send out email');

if (getSetting('mailUrl')) {
  process.env.MAIL_URL = getSetting('mailUrl');
}

Meteor.startup(function() {
  if (typeof SyncedCron !== 'undefined') {
    SyncedCron.start();
  }
});

Inject.obj('serverTimezoneOffset', {offset: new Date().getTimezoneOffset()});
