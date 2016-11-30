import Telescope from 'meteor/nova:lib';
import Posts from '../collection.js'
import marked from 'marked';
import Users from 'meteor/nova:users';


//////////////////////////////////////////////////////
// posts.new.validate                               //
//////////////////////////////////////////////////////


/**
 * @summary Check that the current user can post
 */
// function PostsNewUserCheck (post, user) {
//   // check that user can post
//   if (!user || !Users.canDo(user, "posts.new"))
//     throw new Meteor.Error(601, 'you_need_to_login_or_be_invited_to_post_new_stories');
//   return post;
// }
// Telescope.callbacks.add("posts.new.validate", PostsNewUserCheck);

/**
 * @summary Rate limiting
 */
function PostsNewRateLimit (post, user) {

  if(!Users.isAdmin(user)){

    var timeSinceLastPost = Users.timeSinceLast(user, Posts),
      numberOfPostsInPast24Hours = Users.numberOfItemsInPast24Hours(user, Posts),
      postInterval = Math.abs(parseInt(Telescope.settings.get('postInterval', 30))),
      maxPostsPer24Hours = Math.abs(parseInt(Telescope.settings.get('maxPostsPerDay', 30)));

    // check that user waits more than X seconds between posts
    if(timeSinceLastPost < postInterval)
      throw new Meteor.Error(604, 'please_wait'+(postInterval-timeSinceLastPost)+'seconds_before_posting_again');

    // check that the user doesn't post more than Y posts per day
    if(numberOfPostsInPast24Hours > maxPostsPer24Hours)
      throw new Meteor.Error(605, 'sorry_you_cannot_submit_more_than'+maxPostsPer24Hours+'posts_per_day');

  }

  return post;
}
Telescope.callbacks.add("posts.new.validate", PostsNewRateLimit);

/**
 * @summary Properties
 */
// function PostsNewSubmittedPropertiesCheck (post, user) {

//   // admin-only properties
//   // status
//   // postedAt
//   // userId
//   // sticky (default to false)

//   const schema = Posts.simpleSchema()._schema;

//   // go over each schema field and throw an error if it's not editable
//   _.keys(post).forEach(function (fieldName) {

//     var field = schema[fieldName];
//     if (!Users.canInsertField (user, field)) {
//       throw new Meteor.Error("disallowed_property", 'disallowed_property_detected' + ": " + fieldName);
//     }

//   });
//   // note: not needed there anymore, this is already set in the next callback 'posts.new.sync' with other related properties (status, createdAt)
//   // if no post status has been set, set it now
//   // if (!post.status) {
//   //   post.status = Posts.getDefaultStatus(user);
//   // }

//   // if no userId has been set, default to current user id
//   if (!post.userId) {
//     post.userId = user._id;
//   }

//   return post;
// }
// Telescope.callbacks.add("posts.new.validate", PostsNewSubmittedPropertiesCheck);


//////////////////////////////////////////////////////
// posts.new.sync                                   //
//////////////////////////////////////////////////////


/**
 * @summary Check for duplicate links
 */
function PostsNewDuplicateLinksCheck (post, user) {
  if(!!post.url) {
    Posts.checkForSameUrl(post.url);
  }
  return post;
}
Telescope.callbacks.add("posts.new.sync", PostsNewDuplicateLinksCheck);

/**
 * @summary Check for necessary properties
 */
// function PostsNewRequiredPropertiesCheck (post, user) {

//   // initialize default properties
//   const defaultProperties = {
//     createdAt: new Date(),
//     author: Users.getDisplayNameById(post.userId),
//     status: Posts.getDefaultStatus(user)
//   };

//   post = _.extend(defaultProperties, post);

//   // generate slug
//   post.slug = Telescope.utils.slugify(post.title);

//   // if post is approved but doesn't have a postedAt date, give it a default date
//   // note: pending posts get their postedAt date only once theyre approved
//   if (Posts.isApproved(post) && !post.postedAt) {
//     post.postedAt = new Date();
//   }

//   return post;
// }
// Telescope.callbacks.add("posts.new.sync", PostsNewRequiredPropertiesCheck);

/**
 * @summary Set the post's postedAt if it's approved
 */
function PostsSetPostedAt (post, user) {
  if (!post.postedAt) post.postedAt = new Date();
  return post;
}
Telescope.callbacks.add("posts.new.sync", PostsSetPostedAt);

/**
 * @summary Set the post's isFuture to true if necessary
 */
function PostsNewSetFuture (post, user) {
  post.isFuture = post.postedAt && new Date(post.postedAt).getTime() > new Date(post.createdAt).getTime() + 1000; // round up to the second
  return post;
}
Telescope.callbacks.add("posts.new.sync", PostsNewSetFuture);


//////////////////////////////////////////////////////
// posts.new.async                                  //
//////////////////////////////////////////////////////


/**
 * @summary Increment the user's post count
 */
function PostsNewIncrementPostCount (post) {
  var userId = post.userId;
  Users.update({_id: userId}, {$inc: {"__postCount": 1}});
}
Telescope.callbacks.add("posts.new.async", PostsNewIncrementPostCount);

/**
 * @summary Make users upvote their own new posts
 */
function PostsNewUpvoteOwnPost (post) {
  if (typeof Telescope.operateOnItem !== "undefined") {
    var postAuthor = Users.findOne(post.userId);
    Telescope.operateOnItem(Posts, post, postAuthor, "upvote");
  }
}
Telescope.callbacks.add("posts.new.async", PostsNewUpvoteOwnPost);

/**
 * @summary Add new post notification callback on post submit
 */
function PostsNewNotifications (post) {

  if (typeof Telescope.notifications !== "undefined") {

    var adminIds = _.pluck(Users.adminUsers({fields: {_id:1}}), '_id');
    var notifiedUserIds = _.pluck(Users.find({'__notifications_posts': true}, {fields: {_id:1}}).fetch(), '_id');
    var notificationData = {
      post: _.pick(post, '_id', 'userId', 'title', 'url', 'slug')
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
