import Telescope from 'meteor/nova:lib';
import cloudinary from "cloudinary";
import Posts from "meteor/nova:posts";
import Users from 'meteor/nova:users';

const Cloudinary = cloudinary.v2;
const uploadSync = Meteor.wrapAsync(Cloudinary.uploader.upload);

Cloudinary.config({
  cloud_name: Telescope.settings.get("cloudinaryCloudName"),
  api_key: Telescope.settings.get("cloudinaryAPIKey"),
  api_secret: Telescope.settings.get("cloudinaryAPISecret")
});

const CloudinaryUtils = {
  
  // send an image URL to Cloudinary and get a cloudinary result object in return
  uploadImage(imageUrl) {
    try {
      var result = uploadSync(Telescope.utils.addHttp(imageUrl));
      const data = {
        cloudinaryId: result.public_id,
        result: result,
        urls: CloudinaryUtils.getUrls(result.public_id)
      };
      return data;
    } catch (error) {
      console.log("// Cloudinary upload failed for URL: "+imageUrl);
      console.log(error.stack);
    }
  },

  // generate signed URL for each format based off public_id
  getUrls(cloudinaryId) {
    return Telescope.settings.get("cloudinaryFormats").map(format => {
      const url = Cloudinary.url(cloudinaryId, {
        width: format.width, 
        height: format.height, 
        crop: 'fill',
        sign_url: true,
        fetch_format: "auto",
        quality: "auto"
      });
      return {
        name: format.name,
        url: url
      };
    });
  }
};

// methods
Meteor.methods({
  testCloudinaryUpload: function (thumbnailUrl) {
    if (Users.isAdmin(Meteor.user())) {
      thumbnailUrl = typeof thumbnailUrl === "undefined" ? "http://www.telescopeapp.org/images/logo.png" : thumbnailUrl;
      const data = CloudinaryUtils.uploadImage(thumbnailUrl);
      console.log(data);
    }
  },
  cachePostThumbnails: function (limit = 20) {

    if (Users.isAdmin(Meteor.user())) {

      var postsWithUncachedThumbnails = Posts.find({
        thumbnailUrl: { $exists: true },
        originalThumbnailUrl: { $exists: false }
      }, {sort: {createdAt: -1}, limit: limit});

      postsWithUncachedThumbnails.forEach(Meteor.bindEnvironment((post, index) => {

          Meteor.setTimeout(function () {
          console.log(`// ${index}. Caching thumbnail for post “${post.title}” (_id: ${post._id})`);

          const data = CloudinaryUtils.uploadImage(post.thumbnailUrl);
          Posts.update(post._id, {$set:{
            cloudinaryId: data.cloudinaryId,
            cloudinaryUrls: data.urls
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

      const data = CloudinaryUtils.uploadImage(post.thumbnailUrl);
      Posts.update(post._id, {$set:{
        cloudinaryId: data.cloudinaryId,
        cloudinaryUrls: data.urls
      }});

    }
  }
}
Telescope.callbacks.add("posts.new.async", cachePostThumbnailOnSubmit);

// post edit callback
function cachePostThumbnailOnEdit (newPost, oldPost) {
  if (Telescope.settings.get("cloudinaryAPIKey")) {
    if (newPost.thumbnailUrl && newPost.thumbnailUrl !== oldPost.thumbnailUrl) {
      
      const data = CloudinaryUtils.uploadImage(newPost.thumbnailUrl);
      Posts.update(newPost._id, {$set:{
        cloudinaryId: data.cloudinaryId,
        cloudinaryUrls: data.urls
      }});

    }
  }
}
Telescope.callbacks.add("posts.edit.async", cachePostThumbnailOnEdit);

export default CloudinaryUtils;