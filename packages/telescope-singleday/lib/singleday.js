Telescope.menus.register("viewsMenu", {
  route: 'postsSingleDayDefault',
  label: 'singleday',
  description: 'posts_of_a_single_day'
});

Telescope.viewParameters.singleday = function (terms) {
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
};