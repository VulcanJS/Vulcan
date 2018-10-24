import { Connectors } from 'meteor/vulcan:core';
import { recalculateScore } from '../modules/scoring.js';

/*

Update a document's score if necessary.

Returns how many documents have been updated (1 or 0).

*/
export const updateScore = async ({collection, item, forceUpdate}) => {

  // Age Check
  const postedAt = item && item.postedAt && item.postedAt.valueOf();
  const now = new Date().getTime();
  const age = now - postedAt;
  const ageInHours = age / (60 * 60 * 1000);

  // If for some reason item doesn't have a "postedAt" property, abort
  // Or, if post has been scheduled in the future, don't update its score
  if (!postedAt || postedAt > now)
    return 0;



  // For performance reasons, the database is only updated if the difference between the old score and the new score
  // is meaningful enough. To find out, we calculate the "power" of a single vote after n days.
  // We assume that after n days, a single vote will not be powerful enough to affect posts' ranking order.
  // Note: sites whose posts regularly get a lot of votes can afford to use a lower n.

  // n =  number of days after which a single vote will not have a big enough effect to trigger a score update
  //      and posts can become inactive
  const n = 30;
  // x = score increase amount of a single vote after n days (for n=100, x=0.000040295)
  const x = 1/Math.pow(n*24+2,1.3);

  // HN algorithm
  const newScore = recalculateScore(item);

  // Note: before the first time updateScore runs on a new item, its score will be at 0
  const scoreDiff = Math.abs(item.score || 0 - newScore);

  // console.log('// now: ', now)
  // console.log('// age: ', age)
  // console.log('// ageInHours: ', ageInHours)
  // console.log('// baseScore: ', baseScore)
  // console.log('// item.score: ', item.score)
  // console.log('// newScore: ', newScore)
  // console.log('// scoreDiff: ', scoreDiff)
  // console.log('// x: ', x)

  // only update database if difference is larger than x to avoid unnecessary updates
  if (forceUpdate || scoreDiff > x) {
    await Connectors.update(collection, item._id, {$set: {score: newScore, inactive: false}});
    return 1;
  } else if(ageInHours > n*24) {
    // only set a post as inactive if it's older than n days
    await Connectors.update(collection, item._id, {$set: {inactive: true}});
  }
  return 0;
};

export const batchUpdateScore = async ({collection, inactive = false, forceUpdate = false}) => {
  // INACTIVITY_THRESHOLD_DAYS =  number of days after which a single vote will not have a big enough effect to trigger a score update
  //      and posts can become inactive
  const INACTIVITY_THRESHOLD_DAYS = 30;
  // time decay factor
  const TIME_DECAY_FACTOR = 1.15; //LW: Set this to 1.15 from 1.3 for LW purposes (want slower decay)
  // Basescore bonuses for various categories
  const FRONTPAGE_BONUS = 10;
  const FEATURED_BONUS = 10;
  // x = score increase amount of a single vote after n days (for n=100, x=0.000040295)
  const x = 1/Math.pow(INACTIVITY_THRESHOLD_DAYS*24+2,TIME_DECAY_FACTOR);

  const itemsPromise = collection.rawCollection().aggregate([
    {
      $match: {
        $and: [
          {postedAt: {$exists: true}},
          {postedAt: {$lte: new Date()}},
          {inactive: inactive ? true : {$ne: true}}
        ]
      }
    },
    {
      $project: {
        postedAt: 1,
        score: 1,
        frontpageDate: 1,
        curatedDate: 1,
        baseScore: { // Add optional bonuses to baseScore of posts
          $add: [
            "$baseScore",
            {$cond: {if: "$frontpageDate", then: FRONTPAGE_BONUS, else: 0}},
            {$cond: {if: "$curatedDate", then: FEATURED_BONUS, else: 0}}
          ]
        },
      }
    },
    {
      $project: {
        postedAt: 1,
        baseScore: 1,
        score: 1,
        newScore: {
          $divide: [
            '$baseScore',
              {
                $pow: [
                  {
                    $add: [
                      {
                        $divide: [
                          {
                            $subtract: [new Date(), '$postedAt'] // Age in miliseconds
                          },
                          60 * 60 * 1000
                        ]
                      }, // Age in hours
                      2
                    ]
                  },
                  TIME_DECAY_FACTOR
                ]
              }
            ]
        }
      }
    },
    {
      $project: {
        postedAt: 1,
        baseScore: 1,
        score: 1,
        newScore: 1,
        scoreDiffSignificant: {
          $gt: [
            {$abs: {$subtract: ['$score', '$newScore']}},
            x
          ]
        },
        oldEnough: { // Only set a post as inactive if it's older than n days
          $gt: [
            {$divide: [
              {
                $subtract: [new Date(), '$postedAt'] // Difference in miliseconds
              },
              60 * 60 * 1000 //Difference in hours
            ]},
            INACTIVITY_THRESHOLD_DAYS*24]
        }
      }
    },
  ])

  const items = await itemsPromise;
  const itemsArray = await items.toArray();
  let updatedDocumentsCounter = 0;
  const itemUpdates = _.compact(itemsArray.map(i => {
    if (forceUpdate || i.scoreDiffSignificant) {
      updatedDocumentsCounter++;
      return {
        updateOne: {
          filter: {_id: i._id},
          update: {$set: {score: i.newScore, inactive: false}},
          upsert: false,
        }
      }
    } else if (i.oldEnough) {
      // only set a post as inactive if it's older than n days
      return {
        updateOne: {
          filter: {_id: i._id},
          update: {$set: {inactive: true}},
          upsert: false,
        }
      }
    }
  }))
  if (itemUpdates && itemUpdates.length) {await collection.rawCollection().bulkWrite(itemUpdates, {ordered: false});}
  return updatedDocumentsCounter;
}
