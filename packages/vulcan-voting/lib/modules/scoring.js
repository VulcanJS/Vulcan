export const recalculateScore = item => {

  // Age Check

  if (item.postedAt) {

    const postedAt = item.postedAt.valueOf();
    const now = new Date().getTime();
    const age = now - postedAt;
    const ageInHours = age / (60 * 60 * 1000);

    // time decay factor
    const TIME_DECAY_FACTOR = 1.15; //LW: Set this to 1.15 from 1.3 for LW purposes (want slower decay)

    // use baseScore if defined, if not just use 0
    const baseScore = item.baseScore || 0;

    // HN algorithm
    const newScore = Math.round((baseScore / Math.pow(ageInHours + 2, TIME_DECAY_FACTOR))*1000000)/1000000;

    return newScore;

  } else {

    return item.baseScore;
  
  }

};
