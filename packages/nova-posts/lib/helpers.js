import moment from 'moment';
import Posts from './collection.js';
import Users from 'meteor/nova:users';

//////////////////
// Link Helpers //
//////////////////

/**
 * @summary Return a post's link if it has one, else return its post page URL
 * @param {Object} post
 */
Posts.getLink = function (post, isAbsolute) {
  return !!post.url ? Telescope.utils.getOutgoingUrl(post.url) : this.getPageUrl(post, isAbsolute);
};
Posts.helpers({getLink: function (isAbsolute) {return Posts.getLink(this, isAbsolute);}});

/**
 * @summary Depending on the settings, return either a post's URL link (if it has one) or its page URL.
 * @param {Object} post
 */
Posts.getShareableLink = function (post) {
  return Telescope.settings.get("outsideLinksPointTo", "link") === "link" ? Posts.getLink(post) : Posts.getPageUrl(post, true);
};
Posts.helpers({getShareableLink: function () {return Posts.getShareableLink(this);}});

/**
 * @summary Whether a post's link should open in a new tab or not
 * @param {Object} post
 */
Posts.getLinkTarget = function (post) {
  return !!post.url ? "_blank" : "";
};
Posts.helpers({getLinkTarget: function () {return Posts.getLinkTarget(this);}});

/**
 * @summary Get URL of a post page.
 * @param {Object} post
 */
Posts.getPageUrl = function(post, isAbsolute){
  isAbsolute = typeof isAbsolute === "undefined" ? false : isAbsolute; // default to false
  var prefix = isAbsolute ? Telescope.utils.getSiteUrl().slice(0,-1) : "";
  return `${prefix}/posts/${post._id}/${post.slug}`;
};
Posts.helpers({getPageUrl: function (isAbsolute) {return Posts.getPageUrl(this, isAbsolute);}});

///////////////////
// Other Helpers //
///////////////////

/**
 * @summary Get a post author's name
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
 * @summary Get default status for new posts.
 * @param {Object} user
 */
Posts.getDefaultStatus = function (user) {
  var hasAdminRights = typeof user === 'undefined' ? false : Users.is.admin(user);
  if (hasAdminRights || !Telescope.settings.get('requirePostsApproval', false)) {
    // if user is admin, or else post approval is not required
    return Posts.config.STATUS_APPROVED;
  } else {
    return Posts.config.STATUS_PENDING;
  }
};

/**
 * @summary Check if a post is approved
 * @param {Object} post
 */
Posts.isApproved = function (post) {
  return post.status === Posts.config.STATUS_APPROVED;
};
Posts.helpers({isApproved: function () {return Posts.isApproved(this);}});

/**
 * @summary Check to see if post URL is unique.
 * We need the current user so we know who to upvote the existing post as.
 * @param {String} url
 */
Posts.checkForSameUrl = function (url) {

  // check that there are no previous posts with the same link in the past 6 months
  var sixMonthsAgo = moment().subtract(6, 'months').toDate();
  var postWithSameLink = Posts.findOne({url: url, postedAt: {$gte: sixMonthsAgo}});

  if (typeof postWithSameLink !== 'undefined') {
    throw new Meteor.Error('603', 'this_link_has_already_been_posted', postWithSameLink._id);
  }
};

/**
 * @summary When on a post page, return the current post
 */
Posts.current = function () {
  return Posts.findOne("foo");
};

/**
 * @summary Check to see if a post is a link to a video
 * @param {Object} post
 */
Posts.isVideo = function (post) {
  return post.media && post.media.type === "video";
};
Posts.helpers({isVideo: function () {return Posts.isVideo(this);}});

/**
 * @summary Get the complete thumbnail url whether it is hosted on Embedly or on an external website, or locally in the app.
 * @param {Object} post
 */
Posts.getThumbnailUrl = (post) => {
  const thumbnailUrl = post.thumbnailUrl;
  if (!!thumbnailUrl) {
    return thumbnailUrl.indexOf('//') > -1 ? Telescope.utils.addHttp(thumbnailUrl) : Telescope.utils.getSiteUrl().slice(0,-1) + thumbnailUrl;
  }
};
Posts.helpers({ getThumbnailUrl() { return Posts.getThumbnailUrl(this); } });

///////////////////
// Users Helpers //
///////////////////

/**
 * @summary Check if a given user can view a specific post
 * @param {Object} user - can be undefined!
 * @param {Object} post
 */
Users.can.viewPost = function (user, post) {

  if (Users.is.admin(user)) {
    return true;
  } else {

    switch (post.status) {

      case Posts.config.STATUS_APPROVED:
        return Users.can.view(user);
      
      case Posts.config.STATUS_REJECTED:
      case Posts.config.STATUS_SPAM:
      case Posts.config.STATUS_PENDING: 
        return Users.can.view(user) && Users.is.owner(user, post);
      
      case Posts.config.STATUS_DELETED:
        return false;
    
    }
  }
}
Users.helpers({canViewPost: function () {return Users.can.viewPost(this, post);}});
