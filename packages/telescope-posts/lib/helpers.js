//////////////////
// Post Helpers //
//////////////////

/**
 * Grab common post properties.
 * @param {Object} post
 */
Posts.getProperties = function (post) {
  var postAuthor = Meteor.users.findOne(post.userId);
  var p = {
    postAuthorName : Users.getDisplayName(postAuthor),
    postTitle : Telescope.utils.cleanUp(post.title),
    profileUrl: getProfileUrlBySlugOrId(post.userId),
    postUrl: Posts.getPageUrl(post),
    thumbnailUrl: post.thumbnailUrl,
    linkUrl: !!post.url ? Posts.getOutgoingUrl(post.url) : Posts.getPageUrl(post._id)
  };

  if(post.url)
    p.url = post.url;

  if(post.htmlBody)
    p.htmlBody = post.htmlBody;

  return p;
};

/**
 * Gives an object containing the appropriate find
 * and options arguments for the subscriptions's Posts.find()
 * @param {Object} terms
 */
Posts.getSubParams = function (terms) {

  var maxLimit = 200;

  // console.log(terms)

  // note: using jquery's extend() with "deep" parameter set to true instead of shallow _.extend()
  // see: http://api.jquery.com/jQuery.extend/

  // initialize parameters by extending baseParameters object, to avoid passing it by reference
  var parameters = Telescope.utils.deepExtend(true, {}, Telescope.viewParameters.baseParameters);

  // if view is not defined, default to "top"
  var view = !!terms.view ? Telescope.utils.dashToCamel(terms.view) : 'top';

  // get query parameters according to current view
  if (typeof Telescope.viewParameters[view] !== 'undefined')
    parameters = Telescope.utils.deepExtend(true, parameters, Telescope.viewParameters[view](terms));

  // extend sort to sort posts by _id to break ties
  Telescope.utils.deepExtend(true, parameters, {options: {sort: {_id: -1}}});

  // if a limit was provided with the terms, add it too (note: limit=0 means "no limit")
  if (typeof terms.limit !== 'undefined')
    _.extend(parameters.options, {limit: parseInt(terms.limit)});

  // limit to "maxLimit" posts at most when limit is undefined, equal to 0, or superior to maxLimit
  if(!parameters.options.limit || parameters.options.limit == 0 || parameters.options.limit > maxLimit) {
    parameters.options.limit = maxLimit;
  }

  // hide future scheduled posts unless "showFuture" is set to true or postedAt is already defined
  if (!parameters.showFuture && !parameters.find.postedAt)
    parameters.find.postedAt = {$lte: new Date()};

  // console.log(parameters);

  return parameters;
};

/**
 * Get default status for new posts.
 * @param {Object} user
 */
Posts.getDefaultStatus = function (user) {
  var hasAdminRights = typeof user === 'undefined' ? false : Users.is.admin(user);
  if (hasAdminRights || !Settings.get('requirePostsApproval', false)) {
    // if user is admin, or else post approval is not required
    return Posts.config.STATUS_APPROVED
  } else {
    // else
    return Posts.config.STATUS_PENDING
  }
};

/**
 * Get URL of a post page.
 * @param {Object} post
 */
Posts.getPageUrl = function(post){
  return Telescope.utils.getSiteUrl()+'posts/'+post._id;
};

/**
 * Get post edit page URL.
 * @param {String} id
 */
Posts.getEditUrl = function(id){
  return Telescope.utils.getSiteUrl()+'posts/'+id+'/edit';
};

/**
 * Return a post's link if it has one, else return its post page URL
 * @param {Object} post
 */
Posts.getLink = function (post) {
  return !!post.url ? Posts.getOutgoingUrl(post.url) : this.getPageUrl(post);
};

/**
 * Check to see if post URL is unique.
 * We need the current user so we know who to upvote the existing post as.
 * @param {String} url
 * @param {Object} currentUser
 */
Posts.checkForSameUrl = function (url, currentUser) {

  // check that there are no previous posts with the same link in the past 6 months
  var sixMonthsAgo = moment().subtract(6, 'months').toDate();
  var postWithSameLink = Posts.findOne({url: url, postedAt: {$gte: sixMonthsAgo}});

  if(typeof postWithSameLink !== 'undefined'){
    Telescope.upvoteItem(Posts, postWithSameLink, currentUser);

    // note: error.details returns undefined on the client, so add post ID to reason
    throw new Meteor.Error('603', i18n.t('this_link_has_already_been_posted') + '|' + postWithSameLink._id, postWithSameLink._id);
  }
};

/**
 * When on a post page, return the current post
 */
Posts.current = function () {
  return Posts.findOne(Router.current().data()._id);
};

Posts.getOutgoingUrl = function(url) {
  return Telescope.utils.getRouteUrl('out', {}, {query: {url: url}});
};
