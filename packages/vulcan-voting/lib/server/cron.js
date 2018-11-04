import { /*updateScore,*/ batchUpdateScore } from './scoring.js';
import { VoteableCollections } from '../modules/make_voteable.js';
import { SyncedCron } from 'meteor/percolatestudio:synced-cron';

// Setting voting.scoreUpdateInterval removed and replaced with a hard-coded
// interval because the time-parsing library we use can't handle numbers of
// seconds >= 60; rather than treat them as minutes (like you'd expect), it
// treats intervals like "every 100 seconds" as a syntax error.
//
//registerSetting('voting.scoreUpdateInterval', 60, 'How often to update scores, in seconds');
//const scoreInterval = parseInt(getSetting('voting.scoreUpdateInterval', 60));

SyncedCron.options = {
  log: true,
  collectionName: 'cronHistory',
  utc: false,
  collectionTTL: 172800
};

Meteor.startup(function () {
  SyncedCron.add({
    name: 'updateScoreActiveDocuments',
    schedule(parser) {
      return parser.text(`every 30 seconds`);
    },
    job() {
      VoteableCollections.forEach(collection => {
        batchUpdateScore({collection});
      });
    }
  });
  SyncedCron.add({
    name: 'updateScoreInactiveDocuments',
    schedule(parser) {
      return parser.text('every 24 hours');
    },
    job() {
      VoteableCollections.forEach(collection => {
        batchUpdateScore({collection, inactive: true});
      });
    }
  });
});
