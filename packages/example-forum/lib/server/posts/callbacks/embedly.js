/*

Callbacks to add media/thumbnail after submit and on edit

*/

import { addCallback, getSetting } from 'meteor/vulcan:core';
import { Embed } from 'meteor/vulcan:embed';

const embedProvider = getSetting('embedProvider');

// For security reason, we make the media property non-modifiable by the client and
// we use a separate server-side API call to set it (and the thumbnail object if it hasn't already been set)

// Async variant that directly modifies the post object with update()
function AddMediaAfterSubmit (post) {

  if(post.url){

    const data = Embed[embedProvider].getData(post.url);

    if (data) {

      // only add a thumbnailUrl if there isn't one already
      if (!post.thumbnailUrl && data.thumbnailUrl) {
        post.thumbnailUrl = data.thumbnailUrl;
      }

      // add media if necessary
      if (data.media && data.media.html) {
        post.media = data.media;
      }

      // add source name & url if they exist
      if (data.sourceName && data.sourceUrl) {
        post.sourceName = data.sourceName;
        post.sourceUrl = data.sourceUrl;
      }

    }

  }
  
  return post;
}
addCallback('posts.new.sync', AddMediaAfterSubmit);

function updateMediaOnEdit (modifier, post) {
  
  const newUrl = modifier.$set.url;

  if(newUrl && newUrl !== post.url){

    const data = Embed[embedProvider].getData(newUrl);

    if(data) {

      if (data.media && data.media.html) {
        if (modifier.$unset.media) {
          delete modifier.$unset.media
        }
        modifier.$set.media = data.media;
      }

      // add source name & url if they exist
      if (data.sourceName && data.sourceUrl) {
        modifier.$set.sourceName = data.sourceName;
        modifier.$set.sourceUrl = data.sourceUrl;
      }

    }
  }
  return modifier;
}
addCallback('posts.edit.sync', updateMediaOnEdit);

const addMediaAfterSubmit = AddMediaAfterSubmit;

const regenerateThumbnail = function (post) {
  delete post.thumbnailUrl;
  delete post.media;
  delete post.sourceName;
  delete post.sourceUrl;
  addMediaAfterSubmit(post);
};

export { addMediaAfterSubmit, updateMediaOnEdit, regenerateThumbnail }
