// ------------------------------------- Schemas -------------------------------- //

// array containing properties to be added to the post/settings/comments schema on startup.
addToPostSchema = [];
addToCommentsSchema = [];
addToSettingsSchema = [];
addToUserSchema = [];

SimpleSchema.extendOptions({
  editable: Match.Optional(Boolean),  // editable: true means the field can be edited by the document's owner
  hidden: Match.Optional(Boolean)     // hidden: true means the field is never shown in a form no matter what
});
// ----------------------------------- Posts Statuses ------------------------------ //

postStatuses = [
  {
    value: 1,
    label: 'Pending'
  },
  {
    value: 2,
    label: 'Approved'
  },
  {
    value: 3,
    label: 'Rejected'
  }
]

STATUS_PENDING=1;
STATUS_APPROVED=2;
STATUS_REJECTED=3;

// ------------------------------------- Navigation -------------------------------- //


// array containing nav items; initialize with views menu and admin menu
primaryNav = ['viewsMenu', 'adminMenu'];

secondaryNav = ['userMenu', 'notificationsMenu', 'submitButton'];

// array containing items in the admin menu
adminNav = [
  {
    route: 'posts_pending',
    label: 'Pending'
  },
  {
    route: 'posts_scheduled',
    label: 'Scheduled'
  },
  {
    route: 'all-users',
    label: 'Users'
  },
  {
    route: 'settings',
    label: 'Settings'
  },
  {
    route: 'toolbox',
    label: 'Toolbox'
  }
];

// array containing items in the views menu
viewNav = [
  {
    route: 'posts_top',
    label: 'top'
  },
  {
    route: 'posts_new',
    label: 'new'
  },
  {
    route: 'posts_best',
    label: 'best'
  }
];

// ------------------------------------- Views -------------------------------- //


// object containing post list view parameters
viewParameters = {};

// will be common to all other view unless specific properties are overwritten
viewParameters.baseParameters = {
  find: {
    status: STATUS_APPROVED
  },
  options: {
    limit: 10
  }
};

viewParameters.top = function (terms) {
  return {
    options: {sort: {sticky: -1, score: -1}}
  };
}

viewParameters.new = function (terms) {
  return {
    options: {sort: {sticky: -1, postedAt: -1}}
  };
}

viewParameters.best = function (terms) {
  return {
    options: {sort: {sticky: -1, baseScore: -1}}
  };
}

viewParameters.pending = function (terms) {
  return {
    find: {
      status: 1
    }, 
    options: {sort: {createdAt: -1}},
    showFuture: true
  };
}

viewParameters.scheduled = function (terms) {
  return {
    find: {postedAt: {$gte: new Date()}},
    options: {sort: {postedAt: -1}},
    showFuture: true
  };
}

viewParameters.userPosts = function (terms) {
  return {
    find: {userId: terms.userId},
    options: {limit: 5, sort: {postedAt: -1}}
  };
}

viewParameters.userUpvotedPosts = function (terms) {
  var user = Meteor.users.findOne(terms.userId);
  var postsIds = _.pluck(user.votes.upvotedPosts, "itemId");
  return {
    find: {_id: {$in: postsIds}, userId: {$ne: terms.userId}}, // exclude own posts
    options: {limit: 5, sort: {postedAt: -1}}
  };
}

viewParameters.userDownvotedPosts = function (terms) {
  var user = Meteor.users.findOne(terms.userId);
  var postsIds = _.pluck(user.votes.downvotedPosts, "itemId");
  // TODO: sort based on votedAt timestamp and not postedAt, if possible
  return {
    find: {_id: {$in: postsIds}},
    options: {limit: 5, sort: {postedAt: -1}}
  };
}

heroModules = [];

footerModules = [];

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
    template: 'postActions',
    position: 'left-right'
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

postHeading = [
  {
    template: 'postTitle',
    order: 1
  },
  {
    template: 'postDomain', 
    order: 5
  }
];

postMeta = [
  {
    template: 'postAuthor',
    order: 1
  },
  {
    template: 'postInfo',
    order: 2
  },
  {
    template: 'postCommentsLink',
    order: 3
  },  
  {
    template: 'postAdmin', 
    order: 5
  }
]
// ------------------------------ Callbacks ------------------------------ //

postSubmitRenderedCallbacks = [];
postSubmitClientCallbacks = [];
postSubmitMethodCallbacks = [];
postAfterSubmitMethodCallbacks = [];

postEditRenderedCallbacks = [];
postEditClientCallbacks = [];
postEditMethodCallbacks = []; // not used yet
postAfterEditMethodCallbacks = []; // not used yet

commentSubmitRenderedCallbacks = [];
commentSubmitClientCallbacks = [];
commentSubmitMethodCallbacks = [];
commentAfterSubmitMethodCallbacks = [];

commentEditRenderedCallbacks = []; 
commentEditClientCallbacks = [];
commentEditMethodCallbacks = []; // not used yet
commentAfterEditMethodCallbacks = []; // not used yet

// ------------------------------------- User Profiles -------------------------------- //

userProfileDisplay = [
  {
    template: 'userInfo',
    order: 1
  },
  {
    template: 'userPosts',
    order: 2
  },
  {
    template: 'userUpvotedPosts',
    order: 3
  },  
  {
    template: 'userDownvotedPosts', 
    order: 5
  },  
  {
    template: 'userComments', 
    order: 5
  }
];

userProfileEdit = [
  {
    template: 'userAccount',
    order: 1
  }
]

userEditRenderedCallbacks = [];
userEditClientCallbacks = [];

userProfileCompleteChecks = [
  function(user) {
    return !!getEmail(user) && !!getUserName(user);
  }
];

// ------------------------------ Dynamic Templates ------------------------------ //


templates = {}

getTemplate = function (name) {
  // if template has been overwritten, return this; else return template name
  return !!templates[name] ? templates[name] : name;
}

// ------------------------------ Theme Settings ------------------------------ //

themeSettings = {
  'useDropdowns': true // whether or not to use dropdown menus in a theme
};

// ------------------------------ Subscriptions ------------------------------ //

// array containing subscriptions to be preloaded
preloadSubscriptions = [];