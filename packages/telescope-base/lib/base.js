// Initialize common arrays

// array containing properties to be added to the post schema on startup.
addToPostSchema = [];

// array containing items in the views menu
viewNav = [];

// array containing items in the admin menu
adminNav = [];

// array containing subscriptions to be preloaded
preloadSubscriptions = [];

// array containing post modules (not used yet)
postModules = ['postRank', 'postVote', 'postInfo', 'postShare', 'postDiscuss'];

// array containing nav items; initialize with views menu
navItems = ['viewsMenu'];

// object containing post list view parameters
viewParameters = {}

viewParameters.top = function (terms, baseParameters) {
  return deepExtend(true, baseParameters, {options: {sort: {sticky: -1, score: -1}}});
}

viewParameters.new = function (terms, baseParameters) {
  return deepExtend(true, baseParameters, {options: {sort: {sticky: -1, postedAt: -1}}});
}

viewParameters.best = function (terms, baseParameters) {
  return deepExtend(true, baseParameters, {options: {sort: {sticky: -1, baseScore: -1}}});
}

viewParameters.pending = function (terms, baseParameters) {
  return deepExtend(true, baseParameters, {find: {status: 1}, options: {sort: {createdAt: -1}}});
}

viewParameters.digest = function (terms, baseParameters) {
  var parameters = deepExtend(true, baseParameters, {
    find: {
      postedAt: {
        $gte: terms.after, 
        $lt: terms.before
      }
    },
    options: {
      sort: {sticky: -1, baseScore: -1}
    }
  });
  return parameters;
}