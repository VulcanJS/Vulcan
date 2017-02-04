import Telescope from 'meteor/nova:lib'; // TODO move Telescope.notifications to its own namespace
import Posts from '../collection.js'
import marked from 'marked';
import Users from 'meteor/nova:users';
import { addCallback, getSetting, Utils } from 'meteor/nova:core';

//////////////////////////////////////////////////////
// posts.new.validate                               //
//////////////////////////////////////////////////////


/**
 * @summary Rate limiting
 */
function PostsNewRateLimit (post, user) {

  if(!Users.isAdmin(user)){

    var timeSinceLastPost = Users.timeSinceLast(user, Posts),
      numberOfPostsInPast24Hours = Users.numberOfItemsInPast24Hours(user, Posts),
      postInterval = Math.abs(parseInt(getSetting('postInterval', 30))),
      maxPostsPer24Hours = Math.abs(parseInt(getSetting('maxPostsPerDay', 5)));

    // check that user waits more than X seconds between posts
    // if(timeSinceLastPost < postInterval)
    //   throw new Error(Utils.encodeIntlError({id: "posts.rate_limit_error", value: postInterval-timeSinceLastPost}));

    console.log(numberOfPostsInPast24Hours)

    // check that the user doesn't post more than Y posts per day
    if(numberOfPostsInPast24Hours >= maxPostsPer24Hours)
      throw new Error(Utils.encodeIntlError({id: "posts.max_per_day", value: maxPostsPer24Hours}));

  }

  return post;
}
addCallback("posts.new.validate", PostsNewRateLimit);

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
addCallback("posts.new.sync", PostsNewDuplicateLinksCheck);

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
//   post.slug = Utils.slugify(post.title);

//   // if post is approved but doesn't have a postedAt date, give it a default date
//   // note: pending posts get their postedAt date only once theyre approved
//   if (Posts.isApproved(post) && !post.postedAt) {
//     post.postedAt = new Date();
//   }

//   return post;
// }
// addCallback("posts.new.sync", PostsNewRequiredPropertiesCheck);

/**
 * @summary Set the post's postedAt if it's approved
 */
function PostsSetPostedAt (post, user) {
  if (!post.postedAt) post.postedAt = new Date();
  return post;
}
addCallback("posts.new.sync", PostsSetPostedAt);

/**
 * @summary Set the post's isFuture to true if necessary
 */
function PostsNewSetFuture (post, user) {
  post.isFuture = post.postedAt && new Date(post.postedAt).getTime() > new Date(post.createdAt).getTime() + 1000; // round up to the second
  return post;
}
addCallback("posts.new.sync", PostsNewSetFuture);

/**
 * @summary Set the post's slug based on its title
 */
const PostsNewSlugify = post => {
  post.slug = Utils.slugify(post.title);
  
  return post;
}

addCallback("posts.new.sync", PostsNewSlugify);

/**
 * @summary Set the post's HTML content & the excerpt based on its possible body
 */
const PostsNewHTMLContent = post => {
  if (post.body) {
    // excerpt length is configurable via the settings (30 words by default, ~255 characters)
    const excerptLength = getSetting('postExcerptLength', 30); 
    
    // extend the post document
    post = {
      ...post,
      htmlBody: Utils.sanitize(marked(post.body)),
      excerpt: Utils.trimHTML(Utils.sanitize(marked(post.body)), excerptLength),
    };
  }
  
  return post;
}
addCallback("posts.new.sync", PostsNewHTMLContent);

//////////////////////////////////////////////////////
// posts.new.async                                  //
//////////////////////////////////////////////////////


/**
 * @summary Increment the user's post count
 */
function PostsNewIncrementPostCount (post) {
  var userId = post.userId;
  Users.update({_id: userId}, {$inc: {"postCount": 1}});
}
addCallback("posts.new.async", PostsNewIncrementPostCount);

/**
 * @summary Add new post notification callback on post submit
 */
function PostsNewNotifications (post) {

  if (typeof Telescope.notifications !== "undefined") {

    var adminIds = _.pluck(Users.adminUsers({fields: {_id:1}}), '_id');
    var notifiedUserIds = _.pluck(Users.find({'notifications_posts': true}, {fields: {_id:1}}).fetch(), '_id');
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
addCallback("posts.new.async", PostsNewNotifications);
