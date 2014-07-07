// Initialize common arrays

// array containing properties to be added to the post/settings/comments schema on startup.
addToPostSchema = [];
addToCommentsSchema = [];
addToSettingsSchema = [];

// array containing items in the views menu
viewNav = [];

// array containing items in the admin menu
adminNav = [];

// array containing subscriptions to be preloaded
preloadSubscriptions = [];

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

// array containing post modules
modulePositions = [
  'left-left',
  'left-center',
  'left-right',
  'center-left',
  'center-center',
  'center-right',
  'right-left',
  'right-center',
  'right-right'
];

postModules = [
  {
    template: 'postUpvote',
    position: 'left-left'
  },
  {
    template: 'postContent', 
    position: 'center-center'
  },
  {
    template: 'postDiscuss',
    position: 'right-right'
  }
];

// ------------------------------ Callbacks ------------------------------ //

postSubmitClientCallbacks = [];
postSubmitServerCallbacks = [];

postEditClientCallbacks = [];

commentEditClientCallbacks = []; // not used yet
commentEditServerCallbacks = []; // not used yet

commentEditClientCallbacks = []; // not used yet

// ------------------------------ Dynamic Templates ------------------------------ //


templates = {}

getTemplate = function (name) {
  // if template has been overwritten, return this; else return template name
  return !!templates[name] ? templates[name] : name;
}

