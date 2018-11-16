import {Inject} from 'meteor/meteorhacks:inject-initial';
import { SyncedCron } from 'meteor/percolatestudio:synced-cron';
import { getSetting, registerSetting } from 'meteor/vulcan:lib';

import {
  populateComponentsApp,
  populateRoutesApp,
  initializeFragments
} from 'meteor/vulcan:lib';

registerSetting('mailUrl', null, 'The SMTP URL used to send out email');

if (getSetting('mailUrl')) {
  process.env.MAIL_URL = getSetting('mailUrl');
}

Meteor.startup(function() {
  if (typeof SyncedCron !== 'undefined') {
    SyncedCron.start();
  }

  // init the application components and routes, including components & routes from 3rd-party packages
  initializeFragments();
  populateComponentsApp();
  populateRoutesApp();
});

Inject.obj('serverTimezoneOffset', {offset: new Date().getTimezoneOffset()});
