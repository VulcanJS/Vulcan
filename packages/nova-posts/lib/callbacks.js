
//////////////////////////////////////////////////////
// Collection Hooks                                 //
//////////////////////////////////////////////////////

/**
 * Generate HTML body from Markdown on post insert
 */
Posts.before.insert(function (userId, doc) {
  if(!!doc.body)
    doc.htmlBody = Telescope.utils.sanitize(marked(doc.body));
});

/**
 * Generate HTML body from Markdown when post body is updated
 */
Posts.before.update(function (userId, doc, fieldNames, modifier) {
  // if body is being modified or $unset, update htmlBody too
  if (Meteor.isServer && modifier.$set && modifier.$set.body) {
    modifier.$set.htmlBody = Telescope.utils.sanitize(marked(modifier.$set.body));
  }
  if (Meteor.isServer && modifier.$unset && (typeof modifier.$unset.body !== "undefined")) {
    modifier.$unset.htmlBody = "";
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

/**
 * Increment the user's post count
 */
function afterPostSubmitOperations (post) {
  var userId = post.userId;
  Meteor.users.update({_id: userId}, {$inc: {"telescope.postCount": 1}});
  return post;
}
Telescope.callbacks.add("postSubmitAsync", afterPostSubmitOperations);

function setPostedAt (post) {
  if (post.isApproved() && !post.postedAt) {
    post.postedAt = new Date();
  }
  return post;
}
Telescope.callbacks.add("postEdit", setPostedAt);

// ------------------------------------- Votes -------------------------------- //

if (typeof Telescope.operateOnItem !== "undefined") {

  function upvoteOwnPost (post) {
    var postAuthor = Meteor.users.findOne(post.userId);
    Telescope.operateOnItem(Posts, post._id, postAuthor, "upvote");
    return post;
  }
  Telescope.callbacks.add("postSubmitAsync", upvoteOwnPost);

}

// ------------------------------------- Notifications -------------------------------- //

if (typeof Herald !== "undefined") {

  // add new post notification callback on post submit
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
      Herald.createNotification(adminIds, {courier: 'newPendingPost', data: notificationData});
    } else if (!!notifiedUserIds.length) {
      // if post is approved, notify everybody
      Herald.createNotification(notifiedUserIds, {courier: 'newPost', data: notificationData});
    }

  }
  Telescope.callbacks.add("postSubmitAsync", postSubmitNotification);

  function postApprovedNotification (post) {

    var notificationData = {
      post: _.pick(post, '_id', 'userId', 'title', 'url')
    };

    Herald.createNotification(post.userId, {courier: 'postApproved', data: notificationData});
  }
  Telescope.callbacks.add("postApproveAsync", postApprovedNotification);

}