import Posts from '../collection.js'
import marked from 'marked';
import Users from 'meteor/vulcan:users';
import { addCallback, getSetting, Utils } from 'meteor/vulcan:core';

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
    if(timeSinceLastPost < postInterval)
      throw new Error(Utils.encodeIntlError({id: "posts.rate_limit_error", value: postInterval-timeSinceLastPost}));

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
 * @summary Set the post's postedAt if it's going to be approved
 */
function PostsSetPostedAt (post, user) {
  if (!post.postedAt && Posts.getDefaultStatus(user) === Posts.config.STATUS_APPROVED) post.postedAt = new Date();
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
 * @summary Force sticky to default to false when it's not specified
 */
function PostsNewSetStickyToFalse (post, user) {
  if (!post.sticky) {
    post.sticky = false;
  }
  return post;
}
addCallback("posts.new.sync", PostsNewSetStickyToFalse);


/**
 * @summary Set the post's slug based on its title
 */
function PostsNewSlugify (post) {
  post.slug = Utils.slugify(post.title);
  return post;
}
addCallback("posts.new.sync", PostsNewSlugify);

/**
 * @summary Set the post's HTML content & the excerpt based on its possible body
 */
function PostsNewHTMLContent (post) {
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
