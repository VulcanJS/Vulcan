import Telescope from 'meteor/nova:lib';
import {Inject} from 'meteor/meteorhacks:inject-initial';

const Events = new Mongo.Collection('events');

Meteor.startup(function () {
  if (!Events.findOne({name: 'firstRun'})) {
    Events.insert({
      name: 'firstRun',
      unique: true, // will only get logged a single time
      important: true,
      createdAt: new Date(),
    });
  }
});

if (Telescope.settings.get('mailUrl')) {
  process.env.MAIL_URL = Telescope.settings.get('mailUrl');
}

Meteor.startup(function() {
  if (typeof SyncedCron !== 'undefined') {
    SyncedCron.start();
  }
});

Inject.obj('serverTimezoneOffset', {offset: new Date().getTimezoneOffset()});