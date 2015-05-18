Telescope.menuItems.add("viewsMenu", {
  route: 'postsSingleDayDefault',
  label: 'singleday',
  description: 'posts_of_a_single_day'
});

Posts.views.add("singleday", function (terms) {
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
});