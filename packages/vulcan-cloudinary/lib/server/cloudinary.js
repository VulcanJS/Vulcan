import cloudinary from 'cloudinary';
import { Utils, getSetting, registerSetting } from 'meteor/vulcan:core';

registerSetting('cloudinary', null, 'Cloudinary settings');

export const Cloudinary = cloudinary.v2;
const uploadSync = Meteor.wrapAsync(Cloudinary.uploader.upload);
const cloudinarySettings = getSetting('cloudinary');

Cloudinary.config({
  cloud_name: cloudinarySettings.cloudName,
  api_key: cloudinarySettings.apiKey,
  api_secret: cloudinarySettings.apiSecret,
  secure: true,
});

export const CloudinaryUtils = {

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
    return cloudinarySettings.formats.map(format => {
      const url = Cloudinary.url(cloudinaryId, {
        width: format.width,
        height: format.height,
        crop: 'fill',
        sign_url: true,
        fetch_format: 'auto',
        quality: 'auto'
      });
      return {
        name: format.name,
        url: url
      };
    });
  }
};

// methods
// Meteor.methods({
//   testCloudinaryUpload: function (thumbnailUrl) {
//     if (Users.isAdmin(Meteor.user())) {
//       thumbnailUrl = typeof thumbnailUrl === "undefined" ? "http://www.telescopeapp.org/images/logo.png" : thumbnailUrl;
//       const data = CloudinaryUtils.uploadImage(thumbnailUrl);
//       console.log(data); // eslint-disable-line
//     }
//   },
//   cachePostThumbnails: function (limit = 20) {

//     if (Users.isAdmin(Meteor.user())) {

//       console.log(`// caching ${limit} thumbnails…`)

//       var postsWithUncachedThumbnails = Posts.find({
//         thumbnailUrl: { $exists: true },
//         originalThumbnailUrl: { $exists: false }
//       }, {sort: {createdAt: -1}, limit: limit});

//       postsWithUncachedThumbnails.forEach(Meteor.bindEnvironment((post, index) => {

//           Meteor.setTimeout(function () {
//           console.log(`// ${index}. Caching thumbnail for post “${post.title}” (_id: ${post._id})`); // eslint-disable-line

//           const data = CloudinaryUtils.uploadImage(post.thumbnailUrl);
//           Posts.update(post._id, {$set:{
//             cloudinaryId: data.cloudinaryId,
//             cloudinaryUrls: data.urls
//           }});

//         }, index * 1000);

//       }));
//     }
//   }
// });