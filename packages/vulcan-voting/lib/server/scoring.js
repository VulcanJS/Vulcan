import { recalculateScore } from '../modules/scoring.js';

/*

Update a document's score if necessary.

Returns how many documents have been updated (1 or 0).

*/
export const updateScore = ({collection, item, forceUpdate}) => {

  // Age Check

  // If for some reason item doesn't have a "postedAt" property, abort
  // Or, if post has been scheduled in the future, don't update its score
  if (!item.postedAt || postedAt > now)
    return 0;

  const postedAt = item.postedAt.valueOf();
  const now = new Date().getTime();
  const age = now - postedAt;
  const ageInHours = age / (60 * 60 * 1000);

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
    collection.update(item._id, {$set: {score: newScore, inactive: false}});
    return 1;
  } else if(ageInHours > n*24) {
    // only set a post as inactive if it's older than n days
    collection.update(item._id, {$set: {inactive: true}});
  }
  return 0;
};
