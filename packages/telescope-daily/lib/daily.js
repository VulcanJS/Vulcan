viewNav.push({
  route: 'postsDaily',
  label: 'Day By Day'
});

viewParameters.daily = function (terms) {
  return {
    find: {
      postedAt: {
        $gte: terms.after
      }
    },
    options: {
      sort: {createdAt: -1, sticky: -1, baseScore: -1},
      limit: 0
    }
  };
}