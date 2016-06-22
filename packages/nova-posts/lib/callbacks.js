import Posts from './config'
import marked from 'marked';

//////////////////////////////////////////////////////
// Collection Hooks                                 //
//////////////////////////////////////////////////////

/**
 * @summary Generate HTML body and excerpt from Markdown on post insert
 */
Posts.before.insert(function (userId, doc) {
  if(!!doc.body) {
    const htmlBody = Telescope.utils.sanitize(marked(doc.body));
    doc.htmlBody = htmlBody;
    doc.excerpt = Telescope.utils.trimHTML(htmlBody,30);
  }
});

/**
 * @summary Generate HTML body and excerpt from Markdown when post body is updated
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
 * @summary Generate slug when post title is updated
 */
Posts.before.update(function (userId, doc, fieldNames, modifier) {
  // if title is being modified, update slug too
  if (Meteor.isServer && modifier.$set && modifier.$set.title) {
    modifier.$set.slug = Telescope.utils.slugify(modifier.$set.title);
  }
});

/**
 * @summary Disallow $rename
 */
Posts.before.update(function (userId, doc, fieldNames, modifier) {
  if (!!modifier.$rename) {
    throw new Meteor.Error("illegal $rename operator detected!");
  }
});

//////////////////////////////////////////////////////
// Callbacks                                        //
//////////////////////////////////////////////////////

/*

### posts.new.method

- PostsNewUserCheck
- PostsNewRateLimit
- PostsNewSubmittedPropertiesCheck

### posts.new.sync

- PostsNewDuplicateLinksCheck
- PostsNewRequiredPropertiesCheck

### posts.new.async

- PostsNewIncrementPostCount
- PostsNewUpvoteOwnPost
- PostsNewNotifications

### posts.edit.method

- PostsEditUserCheck
- PostsEditSubmittedPropertiesCheck

### posts.edit.sync

- PostsEditForceStickyToFalse

### posts.edit.async

- PostsEditSetPostedAt
- PostsEditRunPostApprovedCallbacks

### posts.approve.async

- PostsApprovedNotification

*/

// ------------------------------------- posts.new.method -------------------------------- //

/**
 * @summary Check that the current user can post
 */
function PostsNewUserCheck (post, user) {
  // check that user can post
  if (!user || !Users.can.post(user))
    throw new Meteor.Error(601, __('you_need_to_login_or_be_invited_to_post_new_stories'));
  return post;
}
Telescope.callbacks.add("posts.new.method", PostsNewUserCheck);

/**
 * @summary Rate limiting
 */
function PostsNewRateLimit (post, user) {

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
Telescope.callbacks.add("posts.new.method", PostsNewRateLimit);

/**
 * @summary Properties
 */
function PostsNewSubmittedPropertiesCheck (post, user) {

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
Telescope.callbacks.add("posts.new.method", PostsNewSubmittedPropertiesCheck);

// ------------------------------------- posts.new.sync -------------------------------- //

/**
 * @summary Check for duplicate links
 */
function PostsNewDuplicateLinksCheck (post, user) {
  if(!!post.url) {
    Posts.checkForSameUrl(post.url, user);
  }
  return post;
}
Telescope.callbacks.add("posts.new.sync", PostsNewDuplicateLinksCheck);

/**
 * @summary Check for necessary properties
 */
function PostsNewRequiredPropertiesCheck (post, user) {

  // initialize default properties
  const defaultProperties = {
    createdAt: new Date(),
    author: Users.getDisplayNameById(post.userId),
    status: Posts.getDefaultStatus()
  };

  post = _.extend(defaultProperties, post);

  // generate slug
  post.slug = Telescope.utils.slugify(post.title);

  // if post is approved but doesn't have a postedAt date, give it a default date
  // note: pending posts get their postedAt date only once theyre approved
  if (Posts.isApproved(post) && !post.postedAt) {
    post.postedAt = new Date();
  }

  return post;
}
Telescope.callbacks.add("posts.new.sync", PostsNewRequiredPropertiesCheck);

// ------------------------------------- posts.new.async -------------------------------- //

/**
 * @summary Increment the user's post count
 */
function PostsNewIncrementPostCount (post) {
  var userId = post.userId;
  Meteor.users.update({_id: userId}, {$inc: {"telescope.postCount": 1}});
}
Telescope.callbacks.add("posts.new.async", PostsNewIncrementPostCount);

/**
 * @summary Make users upvote their own new posts
 */
function PostsNewUpvoteOwnPost (post) {
  if (typeof Telescope.operateOnItem !== "undefined") {
    var postAuthor = Meteor.users.findOne(post.userId);
    Telescope.operateOnItem(Posts, post._id, postAuthor, "upvote");
  }
}
Telescope.callbacks.add("posts.new.async", PostsNewUpvoteOwnPost);

/**
 * @summary Add new post notification callback on post submit
 */
function PostsNewNotifications (post) {

  if (typeof Telescope.notifications !== "undefined") {

    var adminIds = _.pluck(Users.adminUsers({fields: {_id:1}}), '_id');
    var notifiedUserIds = _.pluck(Users.find({'telescope.notifications_posts': true}, {fields: {_id:1}}).fetch(), '_id');
    var notificationData = {
      post: _.pick(post, '_id', 'userId', 'title', 'url')
    };

    // remove post author ID from arrays
    adminIds = _.without(adminIds, post.userId);
    notifiedUserIds = _.without(notifiedUserIds, post.userId);

    if (post.status === Posts.config.STATUS_PENDING && !!adminIds.length) {
      // if post is pending, only notify admins
      Telescope.notifications.create(adminIds, 'newPendingPost', notificationData);
    } else if (!!notifiedUserIds.length) {
      // if post is approved, notify everybody
      Telescope.notifications.create(notifiedUserIds, 'newPost', notificationData);
    }
  }
}
Telescope.callbacks.add("posts.new.async", PostsNewNotifications);

// ------------------------------------- posts.edit.method -------------------------------- //

function PostsEditUserCheck (modifier, post, user) {
  // check that user can edit document
  if (!user || !Users.can.edit(user, post)) {
    throw new Meteor.Error(601, __('sorry_you_cannot_edit_this_post'));
  }
  return modifier;
}
Telescope.callbacks.add("posts.edit.method", PostsEditUserCheck);

function PostsEditSubmittedPropertiesCheck (modifier, post, user) {
  const schema = Posts.simpleSchema()._schema;
  // go over each field and throw an error if it's not editable
  // loop over each operation ($set, $unset, etc.)
  _.each(modifier, function (operation) {
    // loop over each property being operated on
    _.keys(operation).forEach(function (fieldName) {

      var field = schema[fieldName];
      if (!Users.can.editField(user, field, post)) {
        throw new Meteor.Error("disallowed_property", __('disallowed_property_detected') + ": " + fieldName);
      }

    });
  });
  return modifier;
}
Telescope.callbacks.add("posts.edit.method", PostsEditSubmittedPropertiesCheck);

// ------------------------------------- posts.edit.sync -------------------------------- //

/**
 * @summary Force sticky to default to false when it's not specified
 * (simpleSchema's defaultValue does not work on edit, so do it manually in callback)
 */
function PostsEditForceStickyToFalse (modifier, post) {
  if (!modifier.$set.sticky) {
    if (modifier.$unset && modifier.$unset.sticky) {
      delete modifier.$unset.sticky;
    }
    modifier.$set.sticky = false;
  }
  return modifier;
}
Telescope.callbacks.add("posts.edit.sync", PostsEditForceStickyToFalse);

// ------------------------------------- posts.edit.async -------------------------------- //

/**
 * @summary Set postedAt date
 */
function PostsEditSetPostedAt (post, oldPost) {
  // if post is approved but doesn't have a postedAt date, give it a default date
  // note: pending posts get their postedAt date only once theyre approved
  if (Posts.isApproved(post) && !post.postedAt) {
    Posts.update(post._id, {$set:{postedAt: new Date()}});
  }
}
Telescope.callbacks.add("posts.edit.async", PostsEditSetPostedAt);

function PostsEditRunPostApprovedCallbacks (post, oldPost) {
  var now = new Date();

  if (Posts.isApproved(post) && !Posts.isApproved(oldPost)) {
    Telescope.callbacks.runAsync("posts.approve.async", post);
  }
}
Telescope.callbacks.add("posts.edit.async", PostsEditRunPostApprovedCallbacks);

// ------------------------------------- posts.approve.async -------------------------------- //

/**
 * @summary Add notification callback when a post is approved
 */
function PostsApprovedNotification (post) {
  if (typeof Telescope.notifications !== "undefined") {
    var notificationData = {
      post: _.pick(post, '_id', 'userId', 'title', 'url')
    };

    Telescope.notifications.create(post.userId, 'postApproved', notificationData);
  }
}
Telescope.callbacks.add("posts.approve.async", PostsApprovedNotification);
