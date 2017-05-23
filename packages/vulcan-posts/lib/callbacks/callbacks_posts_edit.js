import marked from 'marked';
import Posts from '../collection.js'
import { runCallbacksAsync, addCallback, getSetting, Utils } from 'meteor/vulcan:core';

//////////////////////////////////////////////////////
// posts.edit.sync                                  //
//////////////////////////////////////////////////////


/**
 * @summary Check for duplicate links
 */
function PostsEditDuplicateLinksCheck (modifier, post) {
  if(post.url !== modifier.$set.url && !!modifier.$set.url) {
    Posts.checkForSameUrl(modifier.$set.url);
  }
  return modifier;
};
addCallback("posts.edit.sync", PostsEditDuplicateLinksCheck);

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
addCallback("posts.edit.sync", PostsEditForceStickyToFalse);

/**
 * @summary Set status
 */
function PostsEditSetIsFuture (modifier, post) {
  // if a post's postedAt date is in the future, set isFuture to true
  modifier.$set.isFuture = modifier.$set.postedAt && new Date(modifier.$set.postedAt).getTime() > new Date().getTime() + 1000;
  return modifier;
}
addCallback("posts.edit.sync", PostsEditSetIsFuture);


function PostsEditRunPostApprovedSyncCallbacks (modifier, post) {
  if (Posts.isApproved(modifier) && !Posts.isApproved(post)) {
    modifier = runCallbacksAsync("posts.approve.sync", modifier, post);
  }
  return modifier;
}
addCallback("posts.edit.sync", PostsEditRunPostApprovedSyncCallbacks);

/**
 * @summary If title is changing, return new slug
 */
function PostsEditSlugify (modifier, post) {
  if (modifier.$set && modifier.$set.title) {
    modifier.$set.slug = Utils.slugify(modifier.$set.title);
  }
  return modifier;
}

addCallback("posts.edit.sync", PostsEditSlugify);

/**
 * @summary If body is changing, update related fields (htmlBody & excerpt)
 */
function PostsEditHTMLContent (modifier, post) {
  if (modifier.$set && typeof modifier.$set.body !== 'undefined') {
    // excerpt length is configurable via the settings (30 words by default, ~255 characters)
    const excerptLength = getSetting('postExcerptLength', 30); 
    
    // extend the modifier
    modifier.$set = {
      ...modifier.$set,
      htmlBody: Utils.sanitize(marked(modifier.$set.body)),
      excerpt: Utils.trimHTML(Utils.sanitize(marked(modifier.$set.body)), excerptLength),
    };
  } else if (modifier.$unset && modifier.$unset.body) {
    // extend the modifier
    modifier.$unset = {
      ...modifier.$unset,
      htmlBody: true,
      excerpt: true,
    };
  }
  
  return modifier;
}
addCallback("posts.edit.sync", PostsEditHTMLContent);

//////////////////////////////////////////////////////
// posts.edit.async                                 //
//////////////////////////////////////////////////////

function PostsEditRunPostApprovedAsyncCallbacks (post, oldPost) {
  if (Posts.isApproved(post) && !Posts.isApproved(oldPost)) {
    runCallbacksAsync("posts.approve.async", post);
  }
}
addCallback("posts.edit.async", PostsEditRunPostApprovedAsyncCallbacks);
