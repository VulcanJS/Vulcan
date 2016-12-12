import Telescope from 'meteor/nova:lib';
import { Callbacks } from 'meteor/nova:core';

function addThumbnailClass (postClass, post) {
  var thumbnailClass = !!post.thumbnailUrl ? "has-thumbnail" : "no-thumbnail";
  return postClass + " " + thumbnailClass;
}
// add callback that adds "has-thumbnail" or "no-thumbnail" CSS classes
Callbacks.add("postClass", addThumbnailClass);

function checkIfPreviouslyPosted (data) {
  Meteor.call("checkForDuplicates", data.url, function (error, result) {
    if (error) {
      // Messages.flash(error.reason + '. <a href="'+FlowRouter.path("postPage", {_id: error.details})+'">'+"go_to_post"+'</a>');
    }
  });
  return data;
}
Callbacks.add("afterEmbedlyPrefill", checkIfPreviouslyPosted);
