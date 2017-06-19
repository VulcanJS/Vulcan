import {Inject} from 'meteor/meteorhacks:inject-initial';
import { SyncedCron } from 'meteor/percolatestudio:synced-cron';
import { getSetting } from 'meteor/vulcan:lib';

if (getSetting('mailUrl')) {
  process.env.MAIL_URL = getSetting('mailUrl');
  console.log("Set Root URL variable");
  process.env.ROOT_URL = "http://www.lesserwrong.com/";
};

Meteor.startup(function() {
  if (typeof SyncedCron !== 'undefined') {
    SyncedCron.start();
  }
});

Inject.obj('serverTimezoneOffset', {offset: new Date().getTimezoneOffset()});
