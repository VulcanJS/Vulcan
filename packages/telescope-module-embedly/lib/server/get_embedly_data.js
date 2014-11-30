getEmbedlyData = function (url) {
  var data = {}
  var extractBase = 'http://api.embed.ly/1/extract';
  var embedlyKey = getSetting('embedlyKey');
  var thumbnailWidth = getSetting('thumbnailWidth', 200);
  var thumbnailHeight = getSetting('thumbnailHeight', 125);
  
  try {
    
    if(!embedlyKey)
      throw new Error("Couldn't find an Embedly API key! Please add it to your Telescope settings.")

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

    result.data.thumbnailUrl = result.data.images[0].url; // add thumbnailUrl as its own property

    return _.pick(result.data, 'title', 'media', 'description', 'thumbnailUrl');

  } catch (error) {
    console.log(error)
    return null;
  }
}

Meteor.methods({
  testGetEmbedlyData: function (url) {
    console.log(getEmbedlyData(url))
  },
  getEmbedlyData: function (url) {
    return getEmbedlyData(url);
  }
});

// For security reason, we use a separate server-side API call to set the media object
var addMediaOnSubmit = function (post) {
  if(post.url){
    var data = getEmbedlyData(post.url);
    if(!!data && !!data.media.html)
      post.media = data.media
  }
  return post;
}
postSubmitMethodCallbacks.push(addMediaOnSubmit);

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