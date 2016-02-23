Cloudinary = Npm.require("cloudinary").v2;

Cloudinary.config({
  cloud_name: Settings.get("cloudinaryCloudName"),
  api_key: Settings.get("cloudinaryAPIKey"),
  api_secret: Settings.get("cloudinaryAPISecret")
});

var uploadSync = Meteor.wrapAsync(Cloudinary.uploader.upload);

// send an image URL to Cloudinary and get a URL in return
var uploadImageFromURL = function (imageUrl) {
  try {
    var result = uploadSync(Telescope.utils.addHttp(imageUrl));
    var cachedUrl = result.url;
    return cachedUrl;
  } catch (error) {
    console.log("// Cloudinary upload failed for URL: "+imageUrl);
    console.log(error.stack);
  }
}

// methods
Meteor.methods({
  testCloudinaryUpload: function (thumbnailUrl) {
    if (Users.is.admin(Meteor.user())) {
      var thumbnailUrl = typeof thumbnailUrl === "undefined" ? "http://www.telescopeapp.org/images/logo.png" : thumbnailUrl;
      var cachedUrl = uploadImageFromURL(thumbnailUrl);
      console.log(cachedUrl);
    }
  },
  cachePostThumbnails: function (limit) {

    // default to caching posts 20 at a time if no limit is passed
    var limit = typeof limit === "undefined" ? 20 : limit;
    
    if (Users.is.admin(Meteor.user())) {

      var postsWithUncachedThumbnails = Posts.find({
        thumbnailUrl: { $exists: true },
        originalThumbnailUrl: { $exists: false }
      }, {sort: {createdAt: -1}, limit: limit});

      postsWithUncachedThumbnails.forEach(Meteor.bindEnvironment(function (post) {

        console.log("// Caching thumbnail for post: "+post.title);

        var originalUrl = post.thumbnailUrl;
        var cachedUrl = uploadImageFromURL(originalUrl);

        Posts.update(post._id, {$set:{
          thumbnailUrl: cachedUrl,
          originalThumbnailUrl: originalUrl
        }});

      }));
    }
  }
});

// post submit callback
function cachePostThumbnailOnSubmit (post) {
  if (Settings.get("cloudinaryAPIKey")) {
    if (post.thumbnailUrl) {
      var newThumbnailUrl = uploadImageFromURL(post.thumbnailUrl);
    }
    Posts.update(post._id, {$set: {
      thumbnailUrl: newThumbnailUrl,
      originalThumbnailUrl: post.thumbnailUrl
    }});
  }
}
Telescope.callbacks.add("postSubmitAsync", cachePostThumbnailOnSubmit);

// post edit callback
function cachePostThumbnailOnEdit (newPost, oldPost) {
  if (Settings.get("cloudinaryAPIKey")) {
    if (newPost.thumbnailUrl && newPost.thumbnailUrl !== oldPost.thumbnailUrl) {
      var newThumbnailUrl = uploadImageFromURL(newPost.thumbnailUrl);
    }
    Posts.update(newPost._id, {$set: {
      thumbnailUrl: newThumbnailUrl,
      originalThumbnailUrl: newPost.thumbnailUrl
    }});
  }
}
Telescope.callbacks.add("postEditAsync", cachePostThumbnailOnEdit);
