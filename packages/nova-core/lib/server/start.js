import {Inject} from 'meteor/meteorhacks:inject-initial';
import { SyncedCron } from 'meteor/percolatestudio:synced-cron';
import { getSetting } from 'meteor/vulcan:lib';

if (getSetting('mailUrl')) {
  process.env.MAIL_URL = getSetting('mailUrl');
}

Meteor.startup(function() {
  if (typeof SyncedCron !== 'undefined') {
    SyncedCron.start();
  }
});

Inject.obj('serverTimezoneOffset', {offset: new Date().getTimezoneOffset()});
