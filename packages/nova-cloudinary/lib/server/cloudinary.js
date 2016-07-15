import cloudinary from "cloudinary";
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

const Cloudinary = cloudinary.v2;

Cloudinary.config({
  cloud_name: Telescope.settings.get("cloudinaryCloudName"),
  api_key: Telescope.settings.get("cloudinaryAPIKey"),
  api_secret: Telescope.settings.get("cloudinaryAPISecret")
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
};

// methods
Meteor.methods({
  testCloudinaryUpload: function (thumbnailUrl) {
    if (Users.is.admin(Meteor.user())) {
      thumbnailUrl = typeof thumbnailUrl === "undefined" ? "http://www.telescopeapp.org/images/logo.png" : thumbnailUrl;
      const cachedUrl = uploadImageFromURL(thumbnailUrl);
      console.log(cachedUrl);
    }
  },
  cachePostThumbnails: function (limit = 20) {

    if (Users.is.admin(Meteor.user())) {

      var postsWithUncachedThumbnails = Posts.find({
        thumbnailUrl: { $exists: true },
        originalThumbnailUrl: { $exists: false }
      }, {sort: {createdAt: -1}, limit: limit});

      postsWithUncachedThumbnails.forEach(Meteor.bindEnvironment((post, index) => {

          Meteor.setTimeout(function () {
          console.log(`// ${index}. Caching thumbnail for post “${post.title}” (_id: ${post._id})`);

          var originalUrl = post.thumbnailUrl;
          var cachedUrl = uploadImageFromURL(originalUrl);

          Posts.update(post._id, {$set:{
            thumbnailUrl: cachedUrl,
            originalThumbnailUrl: originalUrl
          }});
          
        }, index * 1000);
      
      }));
    }
  }
});

// post submit callback
function cachePostThumbnailOnSubmit (post) {
  if (Telescope.settings.get("cloudinaryAPIKey")) {
    if (post.thumbnailUrl) {
      var newThumbnailUrl = uploadImageFromURL(post.thumbnailUrl);
    }
    Posts.update(post._id, {$set: {
      thumbnailUrl: newThumbnailUrl,
      originalThumbnailUrl: post.thumbnailUrl
    }});
  }
}
Telescope.callbacks.add("posts.new.async", cachePostThumbnailOnSubmit);

// post edit callback
function cachePostThumbnailOnEdit (newPost, oldPost) {
  if (Telescope.settings.get("cloudinaryAPIKey")) {
    if (newPost.thumbnailUrl && newPost.thumbnailUrl !== oldPost.thumbnailUrl) {
      var newThumbnailUrl = uploadImageFromURL(newPost.thumbnailUrl);
    }
    Posts.update(newPost._id, {$set: {
      thumbnailUrl: newThumbnailUrl,
      originalThumbnailUrl: newPost.thumbnailUrl
    }});
  }
}
Telescope.callbacks.add("posts.edit.async", cachePostThumbnailOnEdit);
