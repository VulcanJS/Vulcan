viewNav.push({
  route: 'posts_digest_default',
  label: 'digest',
  description: 'posts_of_a_single_day'
});

viewParameters.digest = function (terms) {
  return {
    find: {
      postedAt: {
        $gte: terms.after, 
        $lt: terms.before
      }
    },
    options: {
      sort: {sticky: -1, baseScore: -1, limit: 0}
    }
  };
}

getDigestURL = function(moment){
  return Router.routes['posts_digest'].path({
    year: moment.year(),
    month: moment.month() + 1,
    day: moment.date()
  });
};