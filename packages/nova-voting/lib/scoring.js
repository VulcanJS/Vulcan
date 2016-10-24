import Telescope from 'meteor/nova:lib';

Telescope.updateScore = function (args) {
  const collection = args.collection;
  const item = args.item;
  const forceUpdate = args.forceUpdate;

  // console.log(item)

  // Status Check

  // Age Check


  // For performance reasons, the database is only updated if the difference between the old score and the new score
  // is meaningful enough. To find out, we calculate the "power" of a single vote after n days.
  // We assume that after n days, a single vote will not be powerful enough to affect posts' ranking order.
  // Note: sites whose posts regularly get a lot of votes can afford to use a lower n.

  //power algo

  // console.log(now)
  // console.log(age)
  // console.log(ageInHours)
  // console.log(baseScore)
  // console.log(newScore)
  const newScore = Telescope.callbacks.run("scoring.all");
  // Note: before the first time updateScore runs on a new item, its score will be at 0
  const scoreDiff = Math.abs(item.score - newScore);

  // only update database if difference is larger than x to avoid unnecessary updates
  if (forceUpdate || scoreDiff > x){
    collection.update(item._id, {$set: {score: newScore, inactive: false}});
    return 1;
  }else if(ageInHours > n*24){
    // only set a post as inactive if it's older than n days
    collection.update(item._id, {$set: {inactive: true}});
  }
  return 0;
};

// ------------------------------------- scoring.all -------------------------------- //

/**
 * @summary Check if item is scorable based on its status
 */
function ItemStatusCheck (status) {
  if (!!status && status !== 2) // if item has a status and is not approved, don't update its score
    return 0;
  
  return 1;
}
Telescope.callbacks.add("scoring.all", ItemStatusCheck);

/**
 * @summary Check if item is scorable based on its age
 */
function ItemAgeCheck (postedAt) {
    
    // If for some reason item doesn't have a "postedAt" property, abort
    if (!postedAt)
      return 0;

    postedAt = postedAt.valueOf();
    const now = new Date().getTime();
    const age = now - postedAt;
    const ageInHours = age / (60 * 60 * 1000);

    if (postedAt > now) // if post has been scheduled in the future, don't update its score
      return 0;

    return ageInHours;
}
Telescope.callbacks.add("scoring.all", ItemAgeCheck);

/**
 * @summary PowerAlgorithm
 */
function PowerAlgorithm (baseScore, ageInHours) {  
  
  // n =  number of days after which a single vote will not have a big enough effect to trigger a score update
  //      and posts can become inactive
  const n = 30;
  // x = score increase amount of a single vote after n days (for n=100, x=0.000040295)
  const x = 1/Math.pow(n*24+2,1.3);
  // time decay factor
  const f = 1.3;

  // HN algorithm
  const newScore = baseScore / Math.pow(ageInHours + 2, f);
  
  return newScore;
}
Telescope.callbacks.add("scoring.all", PowerAlgorithm);
