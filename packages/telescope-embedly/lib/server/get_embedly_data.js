getEmbedlyData = function (url) {
  var data = {}
  var extractBase = 'http://api.embed.ly/1/extract';
  var embedlyKey = getSetting('embedlyKey');
  var thumbnailWidth = getSetting('thumbnailWidth', 200);
  var thumbnailHeight = getSetting('thumbnailHeight', 125);

  if(!embedlyKey) {
    // fail silently to still let the post be submitted as usual
    console.log("Couldn't find an Embedly API key! Please add it to your Telescope settings or remove the Embedly module.");
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

    // console.log(result)

    if (!!result.data.images && !!result.data.images.length) // there may not always be an image
      result.data.thumbnailUrl = result.data.images[0].url; // add thumbnailUrl as its own property

    return _.pick(result.data, 'title', 'media', 'description', 'thumbnailUrl');

  } catch (error) {
    console.log(error)
    // the first 13 characters of the Embedly errors are "failed [400] ", so remove them and parse the rest
    var errorObject = JSON.parse(error.message.substring(13));
    throw new Meteor.Error(errorObject.error_code, errorObject.error_message);
    return null;
  }
}

// For security reason, we use a separate server-side API call to set the media object,
// and the thumbnail object if it hasn't already been set

// note: the following function is not used because it would hold up the post submission, use next one instead
// var addMediaOnSubmit = function (post) {
//   if(post.url){
//     var data = getEmbedlyData(post.url);
//     if (!!data) {
//       // only add a thumbnailUrl if there isn't one already
//       if(!post.thumbnailUrl && !!data.thumbnailUrl)
//         post.thumbnailUrl = data.thumbnailUrl
//       // add media if necessary
//       if(!!data.media.html)
//         post.media = data.media
//     }
//   }
//   return post;
// }
// postSubmitMethodCallbacks.push(addMediaOnSubmit);

// Async variant that directly modifies the post object with update()
var addMediaAfterSubmit = function (post) {
  var set = {};
  if(post.url){
    var data = getEmbedlyData(post.url);
    if (!!data) {
      // only add a thumbnailUrl if there isn't one already
      if (!post.thumbnailUrl && !!data.thumbnailUrl) {
        post.thumbnailUrl = data.thumbnailUrl;
        set.thumbnailUrl = data.thumbnailUrl;
      }
      // add media if necessary
      if (!!data.media.html) {
        post.media = data.media;
        set.media = data.media;
      }
    }
  }
  Posts.update(post._id, {$set: set});
  return post;
}
postAfterSubmitMethodCallbacks.push(addMediaAfterSubmit);

// TODO: find a way to only do this is URL has actually changed?
var updateMediaOnEdit = function (updateObject) {
  var post = updateObject.$set
  if(post.url){
    var data = getEmbedlyData(post.url);
    if(!!data && !!data.media.html)
      updateObject.$set.media = data.media
  }
  return updateObject;
}
postEditMethodCallbacks.push(updateMediaOnEdit);


Meteor.methods({
  testGetEmbedlyData: function (url) {
    console.log(getEmbedlyData(url))
  },
  getEmbedlyData: function (url) {
    return getEmbedlyData(url);
  },
  embedlyKeyExists: function () {
    return !!getSetting('embedlyKey');
  },
  regenerateEmbedlyData: function (post) {
    if (can.edit(Meteor.user(), post)) {
      addMediaAfterSubmit(post);
    }
  }
});