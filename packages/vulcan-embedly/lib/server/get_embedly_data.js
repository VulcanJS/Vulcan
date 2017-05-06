import Posts from "meteor/vulcan:posts";
import { addCallback, getSetting } from 'meteor/vulcan:core';

function getEmbedlyData(url) {
  var extractBase = 'http://api.embed.ly/1/extract';
  var embedlyKey = getSetting('embedlyKey');
  // 200 x 200 is the minimum size accepted by facebook
  var thumbnailWidth = getSetting('thumbnailWidth', 400);
  var thumbnailHeight = getSetting('thumbnailHeight', 300);

  if(!embedlyKey) {
    // fail silently to still let the post be submitted as usual
    console.log("Couldn't find an Embedly API key! Please add it to your Telescope settings or remove the Embedly module."); // eslint-disable-line
    return null;
  }

  try {

    var result = Meteor.http.get(extractBase, {
      params: {
        key: embedlyKey,
        url: url,
        image_width: thumbnailWidth,
        image_height: thumbnailHeight,
        image_method: 'crop'
      }
    });

    if (!!result.data.images && !!result.data.images.length) // there may not always be an image
      result.data.thumbnailUrl = result.data.images[0].url.replace("http:","") // add thumbnailUrl as its own property

    if (result.data.authors && result.data.authors.length > 0) {
      result.data.sourceName = result.data.authors[0].name;
      result.data.sourceUrl = result.data.authors[0].url;
    }

    var embedlyData = _.pick(result.data, 'title', 'media', 'description', 'thumbnailUrl', 'sourceName', 'sourceUrl');

    return embedlyData;

  } catch (error) {
    console.log(error); // eslint-disable-line
    // the first 13 characters of the Embedly errors are "failed [400] ", so remove them and parse the rest
    var errorObject = JSON.parse(error.message.substring(13));
    throw new Error(errorObject.error_code, errorObject.error_message);
  }
}

// For security reason, we make the media property non-modifiable by the client and
// we use a separate server-side API call to set it (and the thumbnail object if it hasn't already been set)

// Async variant that directly modifies the post object with update()
function addMediaAfterSubmit (post) {
  var set = {};
  if(post.url){
    var data = getEmbedlyData(post.url);
    if (!!data) {
      // only add a thumbnailUrl if there isn't one already
      if (!post.thumbnailUrl && !!data.thumbnailUrl) {
        set.thumbnailUrl = data.thumbnailUrl;
      }
      // add media if necessary
      if (!!data.media.html) {
        set.media = data.media;
      }
      // add source name & url if they exist
      if (!!data.sourceName && !!data.sourceUrl) {
        set.sourceName = data.sourceName;
        set.sourceUrl = data.sourceUrl;
      }
    }
    // make sure set object is not empty (Embedly call could have failed)
    if(!_.isEmpty(set)) {
      Posts.update(post._id, {$set: set});
    }
  }
}
addCallback("posts.new.async", addMediaAfterSubmit);

function updateMediaOnEdit (modifier, post) {
  var newUrl = modifier.$set.url;
  if(newUrl && newUrl !== post.url){
    var data = getEmbedlyData(newUrl);
    if(!!data) {
      if (!!data.media.html) {
        if (modifier.$unset.media) {
          delete modifier.$unset.media
        }
        modifier.$set.media = data.media;
      }

      // add source name & url if they exist
      if (!!data.sourceName && !!data.sourceUrl) {
        modifier.$set.sourceName = data.sourceName;
        modifier.$set.sourceUrl = data.sourceUrl;
      }
    }
  }
  return modifier;
}
addCallback("posts.edit.sync", updateMediaOnEdit);

var regenerateThumbnail = function (post) {
  delete post.thumbnailUrl;
  delete post.media;
  delete post.sourceName;
  delete post.sourceUrl;
  addMediaAfterSubmit(post);
};

export { getEmbedlyData, addMediaAfterSubmit, updateMediaOnEdit, regenerateThumbnail }
