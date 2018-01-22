import { getSetting, registerSetting, debug } from 'meteor/vulcan:core';
import { /*updateScore,*/ batchUpdateScore } from './scoring.js';
import { VoteableCollections } from '../modules/make_voteable.js';

registerSetting('voting.scoreUpdateInterval', 60, 'How often to update scores, in seconds');

// TODO use a node cron or at least synced-cron
Meteor.startup(function () {
  
  const scoreInterval = parseInt(getSetting('voting.scoreUpdateInterval'));

  if (scoreInterval > 0) {

    VoteableCollections.forEach(collection => {

      // active items get updated every N seconds
      Meteor.setInterval(async function () {

        // let updatedDocuments = 0;

        // console.log('tick ('+scoreInterval+')');
        // collection.find({'inactive': {$ne : true}}).forEach(document => {
        //   updatedDocuments += updateScore({collection, item: document});
        // });

        const updatedDocuments = await batchUpdateScore(collection, false, false);

        debug(`[vulcan:voting] Updated scores for ${updatedDocuments} active documents in collection ${collection.options.collectionName}`)

      }, scoreInterval * 1000);

      // inactive items get updated every hour
      Meteor.setInterval(async function () {


        // let updatedDocuments = 0;
        //
        // collection.find({'inactive': true}).forEach(document => {
        //   updatedDocuments += updateScore({collection, item: document});
        // });

        const updatedDocuments = await batchUpdateScore(collection, true, false);

        debug(`[vulcan:voting] Updated scores for ${updatedDocuments} inactive documents in collection ${collection.options.collectionName}`)

      }, 3600 * 1000);

    });
  }
});

