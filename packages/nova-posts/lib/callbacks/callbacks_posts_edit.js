import Telescope from 'meteor/nova:lib';
import Posts from '../collection.js'
import Users from 'meteor/nova:users';


//////////////////////////////////////////////////////
// posts.edit.validate                              //
//////////////////////////////////////////////////////


// function PostsEditUserCheck (modifier, post, user) {
//   // check that user can edit document
//   if (!user || !Users.canEdit(user, post)) {
//     throw new Meteor.Error(601, 'sorry_you_cannot_edit_this_post');
//   }
//   return modifier;
// }
// Telescope.callbacks.add("posts.edit.validate", PostsEditUserCheck);

// function PostsEditSubmittedPropertiesCheck (modifier, post, user) {
//   const schema = Posts.simpleSchema()._schema;
//   // go over each field and throw an error if it's not editable
//   // loop over each operation ($set, $unset, etc.)
//   _.each(modifier, function (operation) {
//     // loop over each property being operated on
//     _.keys(operation).forEach(function (fieldName) {

//       var field = schema[fieldName];
//       if (!Users.canEditField(user, field, post)) {
//         throw new Meteor.Error("disallowed_property", 'disallowed_property_detected' + ": " + fieldName);
//       }

//     });
//   });
//   return modifier;
// }
// Telescope.callbacks.add("posts.edit.validate", PostsEditSubmittedPropertiesCheck);


//////////////////////////////////////////////////////
// posts.edit.sync                                  //
//////////////////////////////////////////////////////


/**
 * @summary Check for duplicate links
 */
const PostsEditDuplicateLinksCheck = (modifier, post) => {
  if(post.url !== modifier.$set.url && !!modifier.$set.url) {
    Posts.checkForSameUrl(modifier.$set.url);
  }
  return modifier;
};
Telescope.callbacks.add("posts.edit.sync", PostsEditDuplicateLinksCheck);

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

/**
 * @summary Set status
 */
function PostsEditSetIsFuture (modifier, post) {
  // if a post's postedAt date is in the future, set isFuture to true
  modifier.$set.isFuture = modifier.$set.postedAt && new Date(modifier.$set.postedAt).getTime() > new Date().getTime() + 1000;
  return modifier;
}
Telescope.callbacks.add("posts.edit.sync", PostsEditSetIsFuture);

/**
 * @summary Set postedAt date
 */
function PostsEditSetPostedAt (modifier, post) {
  // if post is approved but doesn't have a postedAt date, give it a default date
  // note: pending posts get their postedAt date only once theyre approved
  if (Posts.isApproved(post) && !post.postedAt) {
    modifier.$set.postedAt = new Date();
  }
  return modifier;
}
Telescope.callbacks.add("posts.edit.sync", PostsEditSetPostedAt);


//////////////////////////////////////////////////////
// posts.edit.async                                 //
//////////////////////////////////////////////////////


function PostsEditRunPostApprovedCallbacks (post, oldPost) {
  var now = new Date();

  if (Posts.isApproved(post) && !Posts.isApproved(oldPost)) {
    Telescope.callbacks.runAsync("posts.approve.async", post);
  }
}
Telescope.callbacks.add("posts.edit.async", PostsEditRunPostApprovedCallbacks);
