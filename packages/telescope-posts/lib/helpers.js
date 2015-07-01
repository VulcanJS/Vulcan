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
 * Get URL of a post page.
 * @param {Object} post
 */
Posts.getPageUrl = function(post, isAbsolute){
  var isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  return prefix + Router.path("post_page", post);
};
Posts.helpers({getPageUrl: function (isAbsolute) {return Posts.getPageUrl(this, isAbsolute);}});

/**
 * Get post edit page URL.
 * @param {String} id
 */
Posts.getEditUrl = function(post, isAbsolute){
  var isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  return prefix + Router.path("post_edit", post);
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
