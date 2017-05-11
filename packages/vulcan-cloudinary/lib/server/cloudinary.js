import cloudinary from "cloudinary";
import Posts from "meteor/vulcan:posts";
import Users from 'meteor/vulcan:users';
import { addCallback, Utils, getSetting } from 'meteor/vulcan:core';

const Cloudinary = cloudinary.v2;
const uploadSync = Meteor.wrapAsync(Cloudinary.uploader.upload);

Cloudinary.config({
  cloud_name: getSetting("cloudinaryCloudName"),
  api_key: getSetting("cloudinaryAPIKey"),
  api_secret: getSetting("cloudinaryAPISecret"),
  secure: true,
});

const CloudinaryUtils = {

  // send an image URL to Cloudinary and get a cloudinary result object in return
  uploadImage(imageUrl) {
    try {
      var result = uploadSync(Utils.addHttp(imageUrl));
      const data = {
        cloudinaryId: result.public_id,
        result: result,
        urls: CloudinaryUtils.getUrls(result.public_id)
      };
      return data;
    } catch (error) {
      console.log("// Cloudinary upload failed for URL: "+imageUrl); // eslint-disable-line
      console.log(error); // eslint-disable-line
    }
  },

  // generate signed URL for each format based off public_id
  getUrls(cloudinaryId) {
    return getSetting("cloudinaryFormats").map(format => {
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
      console.log(data); // eslint-disable-line
    }
  },
  cachePostThumbnails: function (limit = 20) {

    if (Users.isAdmin(Meteor.user())) {

      console.log(`// caching ${limit} thumbnails…`)

      var postsWithUncachedThumbnails = Posts.find({
        thumbnailUrl: { $exists: true },
        originalThumbnailUrl: { $exists: false }
      }, {sort: {createdAt: -1}, limit: limit});

      postsWithUncachedThumbnails.forEach(Meteor.bindEnvironment((post, index) => {

          Meteor.setTimeout(function () {
          console.log(`// ${index}. Caching thumbnail for post “${post.title}” (_id: ${post._id})`); // eslint-disable-line

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
  if (getSetting("cloudinaryAPIKey")) {
    if (post.thumbnailUrl) {

      const data = CloudinaryUtils.uploadImage(post.thumbnailUrl);
      if (data) {
        post.cloudinaryId = data.cloudinaryId;
        post.cloudinaryUrls = data.urls;
      }

    }
  }
  return post;
}
addCallback("posts.new.sync", cachePostThumbnailOnSubmit);

function cachePostThumbnailOnEdit (modifier, oldPost) {
  if (getSetting("cloudinaryAPIKey")) {
    if (modifier.$set.thumbnailUrl && modifier.$set.thumbnailUrl !== oldPost.thumbnailUrl) {
      const data = CloudinaryUtils.uploadImage(modifier.$set.thumbnailUrl);
      modifier.$set.cloudinaryId = data.cloudinaryId;
      modifier.$set.cloudinaryUrls = data.urls;
    }
  }
  return modifier;
}
addCallback("posts.edit.sync", cachePostThumbnailOnEdit);


export default CloudinaryUtils;
