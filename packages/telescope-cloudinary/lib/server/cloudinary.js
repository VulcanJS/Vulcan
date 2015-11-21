Cloudinary = Npm.require("cloudinary").v2;

Cloudinary.config({
  cloud_name: Settings.get("cloudinaryCloudName"),
  api_key: Settings.get("cloudinaryAPIKey"),
  api_secret: Settings.get("cloudinaryAPISecret")
});

var uploadSync = Meteor.wrapAsync(Cloudinary.uploader.upload);

// send an image URL to Cloudinary and get a URL in return
var uploadImageFromURL = function (imageUrl) {
  var result = uploadSync(Telescope.utils.addHttp(imageUrl));
  var cachedUrl = result.url;
  return cachedUrl;
}

// test function
Meteor.methods({
  testCloudinaryUpload: function () {
    if (Users.is.admin(Meteor.user())) {
      var cachedUrl = uploadImageFromURL("http://www.telescopeapp.org/images/logo.png");
      console.log(cachedUrl);
    }
  }
});

// post submit callback
function cachePostThumbnailOnSubmit (post) {
  if (post.thumbnailUrl) {
    var newThumbnailUrl = uploadImageFromURL(post.thumbnailUrl);
  }
  Posts.update(post._id, {$set: {
    thumbnailUrl: newThumbnailUrl,
    originalThumbnailUrl: post.thumbnailUrl
  }});
}
Telescope.callbacks.add("postSubmitAsync", cachePostThumbnailOnSubmit);

// post edit callback
function cachePostThumbnailOnEdit (newPost, oldPost) {
  if (newPost.thumbnailUrl && newPost.thumbnailUrl !== oldPost.thumbnailUrl) {
    var newThumbnailUrl = uploadImageFromURL(newPost.thumbnailUrl);
  }
  Posts.update(newPost._id, {$set: {
    thumbnailUrl: newThumbnailUrl,
    originalThumbnailUrl: newPost.thumbnailUrl
  }});
}
Telescope.callbacks.add("postEditAsync", cachePostThumbnailOnEdit);
