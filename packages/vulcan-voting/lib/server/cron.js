import { getSetting } from 'meteor/vulcan:core';
import { updateScore } from './scoring.js';
import { VoteableCollections } from '../modules/make_voteable.js';

// TODO use a node cron or at least synced-cron
Meteor.startup(function () {
  
  const scoreInterval = parseInt(getSetting('scoreUpdateInterval', 60));

  if (scoreInterval > 0) {

    VoteableCollections.forEach(collection => {

      // active items get updated every N seconds
      Meteor.setInterval(function () {
        let updatedDocuments = 0;

        // console.log('tick ('+scoreInterval+')');
        collection.find({'inactive': {$ne : true}}).forEach(document => {
          updatedDocuments += updateScore({collection, item: document});
        });
        console.log(`Updated ${updatedDocuments} active documents in collection ${collection.options.collectionName}`)

      }, scoreInterval * 1000);

      // inactive items get updated every hour
      Meteor.setInterval(function () {
        let updatedDocuments = 0;

        collection.find({'inactive': true}).forEach(document => {
          updatedDocuments += updateScore({collection, item: document});
        });

        console.log(`Updated ${updatedDocuments} inactive documents in collection ${collection.options.collectionName}`)

      }, 3600 * 1000);

    });
  }
});

