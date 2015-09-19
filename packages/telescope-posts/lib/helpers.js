//////////////////
// Link Helpers //
//////////////////

/**
 * Return a post's link if it has one, else return its post page URL
 * @param {Object} post
 */
Posts.getLink = function (post, isAbsolute) {
  return !!post.url ? Telescope.utils.getOutgoingUrl(post.url) : this.getPageUrl(post, isAbsolute);
};
Posts.helpers({getLink: function (isAbsolute) {return Posts.getLink(this, isAbsolute);}});

/**
 * Depending on the settings, return either a post's URL link (if it has one) or its page URL.
 * @param {Object} post
 */
Posts.getShareableLink = function (post) {
  return Settings.get("outsideLinksPointTo", "link") === "link" ? Posts.getLink(post) : Posts.getPageUrl(post, true);
};
Posts.helpers({getShareableLink: function () {return Posts.getShareableLink(this);}});

/**
 * Whether a post's link should open in a new tab or not
 * @param {Object} post
 */
Posts.getLinkTarget = function (post) {
  return !!post.url ? "_blank" : "";
};
Posts.helpers({getLinkTarget: function () {return Posts.getLinkTarget(this);}});

/**
 * Get URL of a post page.
 * @param {Object} post
 */
Posts.getPageUrl = function(post, isAbsolute){
  var isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  return prefix + FlowRouter.path("postPage", post);
};
Posts.helpers({getPageUrl: function (isAbsolute) {return Posts.getPageUrl(this, isAbsolute);}});

/**
 * Get post edit page URL.
 * @param {String} id
 */
Posts.getEditUrl = function(post, isAbsolute){
  var isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  return prefix + FlowRouter.path("postEdit", post);
};
Posts.helpers({getEditUrl: function (isAbsolute) {return Posts.getEditUrl(this, isAbsolute);}});

///////////////////
// Other Helpers //
///////////////////

/**
 * Get a post author's name
 * @param {Object} post
 */
Posts.getAuthorName = function (post) {
  var user = Meteor.users.findOne(post.userId);
  if (user) {
    return user.getDisplayName();
  } else {
    return post.author;
  }
};
Posts.helpers({getAuthorName: function () {return Posts.getAuthorName(this);}});

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
 * Check if a post is approved
 * @param {Object} post
 */
Posts.isApproved = function (post) {
  return post.status === Posts.config.STATUS_APPROVED;
};
Posts.helpers({isApproved: function () {return Posts.isApproved(this);}});

/**
 * Check to see if post URL is unique.
 * We need the current user so we know who to upvote the existing post as.
 * @param {String} url
 */
Posts.checkForSameUrl = function (url) {

  // check that there are no previous posts with the same link in the past 6 months
  var sixMonthsAgo = moment().subtract(6, 'months').toDate();
  var postWithSameLink = Posts.findOne({url: url, postedAt: {$gte: sixMonthsAgo}});

  if (typeof postWithSameLink !== 'undefined') {
    throw new Meteor.Error('603', i18n.t('this_link_has_already_been_posted'), postWithSameLink._id);
  }
};

/**
 * When on a post page, return the current post
 */
Posts.current = function () {
  return Posts.findOne(FlowRouter.getParam("_id"));
};

/**
 * Check to see if a post is a link to a video
 * @param {Object} post
 */
Posts.isVideo = function (post) {
  return post.media && post.media.type === "video";
};
Posts.helpers({isVideo: function () {return Posts.isVideo(this);}});
