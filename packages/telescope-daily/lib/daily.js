viewNav.push({
  route: 'postsDaily',
  label: 'daily'
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