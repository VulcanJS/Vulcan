getEmbedlyDataRaw = function (url) {
  var data = {}
  var extractBase = 'http://api.embed.ly/1/extract';
  var embedlyKey = getSetting('embedlyKey');
  var thumbHeight = getSetting('embedlyThumbnailHeight') ? getSetting('embedlyThumbnailHeight') : 200;
  var thumbWidth = getSetting('embedlyThumbnailWidth') ? getSetting('embedlyThumbnailWidth') : 150;

  try {
    
    if(!embedlyKey)
      throw new Error("Couldn't find an Embedly API key! Please add it to your Telescope settings.")

    var result = Meteor.http.get(extractBase, {
      params: {
        key: embedlyKey,
        url: url,
        image_width: thumbHeight,
        image_height: thumbWidth,
        image_method: 'crop'
      }
    });

    return result;

  } catch (error) {
    console.log(error)
    return null;
  }
}

getEmbedlyKeywords = function(result){
  var keywords = _.pluck(result.data.keywords, 'name');
  return keywords;
}

getEmbedlyData = function(url){
  var data = {};

  var result = getEmbedlyDataRaw(url);
  if(!result){return undefined};

  if(!result.data.images.length)
    throw new Error("Couldn't find an image!");

  data.thumbnailUrl = result.data.images[0].url;
  data.description = result.data.description;
  data.title = result.data.title;
  data.providerName = result.data.provider_name;
  data.providerUrl = result.data.provider_url;
  data.content = result.data.content;
  data.keywords = getEmbedlyKeywords(result);

  if(typeof result.data.media !== 'undefined')
    data.media = result.data.media

  return data;

}

Meteor.methods({
  extractUrlData: function (url) {
    return getEmbedlyData(url);
  },
  setPostThumbnail: function (post) {
    var set = {};
    if(post.url){
      var data = getEmbedlyData(post.url);
      if(!!data && !!data.thumbnailUrl)
        set.thumbnailUrl = data.thumbnailUrl;
      if(!!data && !!data.media.html)
        set.media = data.media
      console.log(set)
      Posts.update({_id: post._id}, {$set: set});
    }
  }
});

/*
var extendPost = function (post) {
  if(post.url){
    var data = getEmbedlyData(post.url);
    if(!!data && !!data.thumbnailUrl)
      post.thumbnailUrl = data.thumbnailUrl;
    if(!!data && !!data.media.html)
      post.media = data.media
  }
  return post;
}

postSubmitMethodCallbacks.push(extendPost);
*/