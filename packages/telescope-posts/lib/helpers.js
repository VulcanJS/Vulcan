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
    profileUrl: Users.getProfileUrlBySlugOrId(post.userId),
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
