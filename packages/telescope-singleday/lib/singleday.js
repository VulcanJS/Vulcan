viewsMenu.push({
  route: 'postsSingleDayDefault',
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
      sort: {sticky: -1, score: -1}
    }
  };
}

getDateURL = function(moment){
  return Router.routes['postsSingleDay'].path({
    year: moment.year(),
    month: moment.month() + 1,
    day: moment.date()
  });
};