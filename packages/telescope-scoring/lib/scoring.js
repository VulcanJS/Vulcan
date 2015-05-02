Telescope.updateScore = function (args) {
  var collection = args.collection;
  var item = args.item;
  var forceUpdate = args.forceUpdate;

  // console.log(item)

  // Status Check

  if (!!item.status && item.status !== 2) // if item has a status and is not approved, don't update its score
    return 0;

  // Age Check

  // If for some reason item doesn't have a "postedAt" property, abort
  if (!item.postedAt)
    return 0;

  var postedAt = item.postedAt.valueOf();
  var now = new Date().getTime();
  var age = now - postedAt;
  var ageInHours = age / (60 * 60 * 1000);

  if (postedAt > now) // if post has been scheduled in the future, don't update its score
    return 0;

  // For performance reasons, the database is only updated if the difference between the old score and the new score
  // is meaningful enough. To find out, we calculate the "power" of a single vote after n days.
  // We assume that after n days, a single vote will not be powerful enough to affect posts' ranking order.
  // Note: sites whose posts regularly get a lot of votes can afford to use a lower n.

  // n =  number of days after which a single vote will not have a big enough effect to trigger a score update
  //      and posts can become inactive
  var n = 30;
  // x = score increase amount of a single vote after n days (for n=100, x=0.000040295)
  var x = 1/Math.pow(n*24+2,1.3);
  // time decay factor
  var f = 1.3;

  // use baseScore if defined, if not just use the number of votes
  // note: for transition period, also use votes if there are more votes than baseScore
  // var baseScore = Math.max(item.votes || 0, item.baseScore || 0);
  var baseScore = item.baseScore;

  // HN algorithm
  var newScore = baseScore / Math.pow(ageInHours + 2, f);

  // console.log(now)
  // console.log(age)
  // console.log(ageInHours)
  // console.log(baseScore)
  // console.log(newScore)

  // Note: before the first time updateScore runs on a new item, its score will be at 0
  var scoreDiff = Math.abs(item.score - newScore);

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
