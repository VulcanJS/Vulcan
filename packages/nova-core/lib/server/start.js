import Telescope from 'meteor/nova:lib';
import Events from "meteor/nova:events";
import { Inject } from 'meteor/meteorhacks:inject-initial';
import { SyncedCron } from 'meteor/percolatestudio:synced-cron';

Meteor.startup(function () {
  Events.log({
    name: "firstRun",
    unique: true, // will only get logged a single time
    important: true
  });
});

if (Telescope.settings.get('mailUrl')) {
  process.env.MAIL_URL = Telescope.settings.get('mailUrl');
}

Meteor.startup(function() {
  if (typeof SyncedCron !== "undefined") {
    SyncedCron.start();
  }
});

Inject.obj('serverTimezoneOffset', {offset: new Date().getTimezoneOffset()});
