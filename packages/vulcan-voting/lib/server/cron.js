import { getSetting, registerSetting, debug } from 'meteor/vulcan:core';
import { /*updateScore,*/ batchUpdateScore } from './scoring.js';
import { VoteableCollections } from '../modules/make_voteable.js';
import { SyncedCron } from 'meteor/percolatestudio:synced-cron';

registerSetting('voting.scoreUpdateInterval', 60, 'How often to update scores, in seconds');
const scoreInterval = parseInt(getSetting('voting.scoreUpdateInterval', 60));

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
        batchUpdateScore(collection, false, false);
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
        batchUpdateScore(collection, true, false);
      });
    }
  });
});
