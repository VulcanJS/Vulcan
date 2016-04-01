
//////////////////////////////////////////////////////
// Collection Hooks                                 //
//////////////////////////////////////////////////////

/**
 * Generate HTML body and excerpt from Markdown on post insert
 */
Posts.before.insert(function (userId, doc) {
  if(!!doc.body) {
    const htmlBody = Telescope.utils.sanitize(marked(doc.body));
    doc.htmlBody = htmlBody;
    doc.excerpt = Telescope.utils.trimHTML(htmlBody,30);
  }
});

/**
 * Generate HTML body and excerpt from Markdown when post body is updated
 */
Posts.before.update(function (userId, doc, fieldNames, modifier) {
  // if body is being modified or $unset, update htmlBody too
  if (Meteor.isServer && modifier.$set && modifier.$set.body) {
    const htmlBody = Telescope.utils.sanitize(marked(modifier.$set.body));
    modifier.$set.htmlBody = htmlBody;
    modifier.$set.excerpt = Telescope.utils.trimHTML(htmlBody,30);
  }
  if (Meteor.isServer && modifier.$unset && (typeof modifier.$unset.body !== "undefined")) {
    modifier.$unset.htmlBody = "";
    modifier.$unset.excerpt = "";
  }
});

/**
 * Generate slug when post title is updated
 */
Posts.before.update(function (userId, doc, fieldNames, modifier) {
  // if title is being modified, update slug too
  if (Meteor.isServer && modifier.$set && modifier.$set.title) {
    modifier.$set.slug = Telescope.utils.slugify(modifier.$set.title);
  }
});

/**
 * Disallow $rename
 */
Posts.before.update(function (userId, doc, fieldNames, modifier) {
  if (!!modifier.$rename) {
    throw new Meteor.Error("illegal $rename operator detected!");
  }
});

//////////////////////////////////////////////////////
// Callbacks                                        //
//////////////////////////////////////////////////////

// ------------------------------------- posts.new.client -------------------------------- //

// ------------------------------------- posts.new.method -------------------------------- //

/**
 * Check that the current user can post
 */
function clientSubmitChecks (post, user) {
  // check that user can post
  if (!user || !Users.can.post(user))
    throw new Meteor.Error(601, __('you_need_to_login_or_be_invited_to_post_new_stories'));
  return post;
}
Telescope.callbacks.add("posts.new.method", clientSubmitChecks);

/**
 * Rate limiting
 */
function rateLimiting (post, user) {

  if(!Users.is.admin(user)){

    var timeSinceLastPost = Users.timeSinceLast(user, Posts),
      numberOfPostsInPast24Hours = Users.numberOfItemsInPast24Hours(user, Posts),
      postInterval = Math.abs(parseInt(Telescope.settings.get('postInterval', 30))),
      maxPostsPer24Hours = Math.abs(parseInt(Telescope.settings.get('maxPostsPerDay', 30)));

    // check that user waits more than X seconds between posts
    if(timeSinceLastPost < postInterval)
      throw new Meteor.Error(604, __('please_wait')+(postInterval-timeSinceLastPost)+__('seconds_before_posting_again'));

    // check that the user doesn't post more than Y posts per day
    if(numberOfPostsInPast24Hours > maxPostsPer24Hours)
      throw new Meteor.Error(605, __('sorry_you_cannot_submit_more_than')+maxPostsPer24Hours+__('posts_per_day'));

  }

  return post;
}
Telescope.callbacks.add("posts.new.method", rateLimiting);

/**
 * Properties
 */
function propertyChecks (post, user) {

  // admin-only properties
  // status
  // postedAt
  // userId
  // sticky (default to false)

  const schema = Posts.simpleSchema()._schema;

  // go over each schema field and throw an error if it's not editable
  _.keys(post).forEach(function (fieldName) {

    var field = schema[fieldName];
    if (!Users.can.submitField(user, field)) {
      throw new Meteor.Error("disallowed_property", __('disallowed_property_detected') + ": " + fieldName);
    }

  });

  return post;
}
Telescope.callbacks.add("posts.new.method", propertyChecks);

/**
 * Properties
 */
function methodDefaultProperties (post, user) {

  // if no post status has been set, set it now
  if (!post.status) {
    post.status = Posts.getDefaultStatus(user);
  }

  // if no userId has been set, default to current user id
  if (!post.userId) {
    post.userId = user._id;
  }

  return post;
}
Telescope.callbacks.add("posts.new.method", methodDefaultProperties);



// ------------------------------------- posts.new.sync -------------------------------- //

/**
 * Check for necessary properties
 */
function postSubmitChecks (post, user) {
  // check that a title was provided
  if(!post.title)
    throw new Meteor.Error(602, __('please_fill_in_a_title'));
  // check that there are no posts with the same URL
  if(!!post.url)
    Posts.checkForSameUrl(post.url, user);
  return post;
}
Telescope.callbacks.add("posts.new.sync", postSubmitChecks);

/**
 * Set properties to default values if missing
 */
function setProperties (post, user) {

  var defaultProperties = {
    createdAt: new Date(),
    author: Users.getDisplayNameById(post.userId),
    upvotes: 0,
    downvotes: 0,
    commentCount: 0,
    clickCount: 0,
    viewCount: 0,
    baseScore: 0,
    score: 0,
    inactive: false,
    sticky: false,
    status: Posts.getDefaultStatus()
  };

  post = _.extend(defaultProperties, post);

  // clean up post title
  post.title = Telescope.utils.cleanUp(post.title);

  // generate slug
  post.slug = Telescope.utils.slugify(post.title);
  return post;
}
Telescope.callbacks.add("posts.new.sync", setProperties);

/**
 * Set postedAt date
 */
function setPostedAt (post, user) {
  // if post is approved but doesn't have a postedAt date, give it a default date
  // note: pending posts get their postedAt date only once theyre approved
  if (Posts.isApproved(post) && !post.postedAt) {
    post.postedAt = new Date();
  }
  return post;
}
Telescope.callbacks.add("posts.new.sync", setPostedAt);

// ------------------------------------- posts.new.async -------------------------------- //

/**
 * Increment the user's post count
 */
function incrementPostCount (post) {
  var userId = post.userId;
  Meteor.users.update({_id: userId}, {$inc: {"telescope.postCount": 1}});
  return post;
}
Telescope.callbacks.add("posts.new.async", incrementPostCount);

/**
 * Make users upvote their own new posts
 */
if (typeof Telescope.operateOnItem !== "undefined") {
  function upvoteOwnPost (post) {
    var postAuthor = Meteor.users.findOne(post.userId);
    Telescope.operateOnItem(Posts, post._id, postAuthor, "upvote");
    return post;
  }
  Telescope.callbacks.add("posts.new.async", upvoteOwnPost);
}

/**
 * Add new post notification callback on post submit
 */
if (typeof Telescope.notifications !== "undefined") {
  function postSubmitNotification (post) {

    var adminIds = _.pluck(Users.adminUsers({fields: {_id:1}}), '_id');
    var notifiedUserIds = _.pluck(Users.find({'telescope.notifications.posts': true}, {fields: {_id:1}}).fetch(), '_id');
    var notificationData = {
      post: _.pick(post, '_id', 'userId', 'title', 'url')
    };

    // remove post author ID from arrays
    adminIds = _.without(adminIds, post.userId);
    notifiedUserIds = _.without(notifiedUserIds, post.userId);

    if (post.status === Posts.config.STATUS_PENDING && !!adminIds.length) {
      // if post is pending, only notify admins
      Telescope.createNotification(adminIds, 'newPendingPost', notificationData);
    } else if (!!notifiedUserIds.length) {
      // if post is approved, notify everybody
      Telescope.createNotification(notifiedUserIds, 'newPost', notificationData);
    }

  }
  Telescope.callbacks.add("posts.new.async", postSubmitNotification);

/**
 * Add notification callback when a post is approved
 */

  function postApprovedNotification (post) {

    var notificationData = {
      post: _.pick(post, '_id', 'userId', 'title', 'url')
    };

    Telescope.createNotification(post.userId, 'postApproved', notificationData);
  }
  Telescope.callbacks.add("posts.approve.async", postApprovedNotification);

}
// ------------------------------------- posts.edit.client -------------------------------- //

// ------------------------------------- posts.edit.method -------------------------------- //

// ------------------------------------- posts.edit.sync -------------------------------- //

/**
 * Force sticky to default to false when it's not specified
 */
function forceStickyToFalse (modifier, post) {
  if (!modifier.$set.sticky) {
    delete modifier.$unset.sticky;
    modifier.$set.sticky = false;
  }
  return modifier;
}
Telescope.callbacks.add("posts.edit.sync", forceStickyToFalse);

// ------------------------------------- posts.edit.async -------------------------------- //

/**
 * Set postedAt date
 */
function setPostedAtOnEdit (post, oldPost) {
  // if post is approved but doesn't have a postedAt date, give it a default date
  // note: pending posts get their postedAt date only once theyre approved
  if (Posts.isApproved(post) && !post.postedAt) {
    Posts.update(post._id, {$set:{postedAt: new Date()}});
  }
}
Telescope.callbacks.add("posts.edit.async", setPostedAtOnEdit);

function runPostApprovedCallbacksOnEdit (post, oldPost) {
  var now = new Date();

  if (Posts.isApproved(post) && !Posts.isApproved(oldPost)) {
    Telescope.callbacks.runAsync("posts.approve.async", post);
  }
}
Telescope.callbacks.add("posts.edit.async", runPostApprovedCallbacksOnEdit);
