// ------------------------------------- Schemas -------------------------------- //


SimpleSchema.extendOptions({
  editable: Match.Optional(Boolean),  // editable: true means the field can be edited by the document's owner
  hidden: Match.Optional(Boolean)     // hidden: true means the field is never shown in a form no matter what
});


// ------------------------------------- Views -------------------------------- //

STATUS_APPROVED = 2;

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
};

viewParameters.new = function (terms) {
  return {
    options: {sort: {sticky: -1, postedAt: -1}}
  };
};

viewParameters.best = function (terms) {
  return {
    options: {sort: {sticky: -1, baseScore: -1}}
  };
};

viewParameters.pending = function (terms) {
  return {
    find: {
      status: 1
    },
    options: {sort: {createdAt: -1}},
    showFuture: true
  };
};

viewParameters.scheduled = function (terms) {
  return {
    find: {postedAt: {$gte: new Date()}},
    options: {sort: {postedAt: -1}}
  };
};

viewParameters.userPosts = function (terms) {
  return {
    find: {userId: terms.userId},
    options: {limit: 5, sort: {postedAt: -1}}
  };
};

viewParameters.userUpvotedPosts = function (terms) {
  var user = Meteor.users.findOne(terms.userId);
  var postsIds = _.pluck(user.votes.upvotedPosts, "itemId");
  return {
    find: {_id: {$in: postsIds}, userId: {$ne: terms.userId}}, // exclude own posts
    options: {limit: 5, sort: {postedAt: -1}}
  };
};

viewParameters.userDownvotedPosts = function (terms) {
  var user = Meteor.users.findOne(terms.userId);
  var postsIds = _.pluck(user.votes.downvotedPosts, "itemId");
  // TODO: sort based on votedAt timestamp and not postedAt, if possible
  return {
    find: {_id: {$in: postsIds}},
    options: {limit: 5, sort: {postedAt: -1}}
  };
};

// ------------------------------ Dynamic Templates ------------------------------ //

templates = {}

// note: not used anymore, but keep for backwards compatibility
getTemplate = function (name) {
  // for now, always point back to the original template
  var originalTemplate = (_.invert(templates))[name];
  return !!originalTemplate ? originalTemplate : name;

  // if template has been overwritten, return this; else return template name
  // return !!templates[name] ? templates[name] : name;
};


// ------------------------------- Vote Power -------------------------------- //

// The equation to determine voting power
// Default to returning 1 for everybody

getVotePower = function (user) {
  return 1;
};
