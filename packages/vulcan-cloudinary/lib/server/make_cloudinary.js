import { CloudinaryUtils } from '../server/cloudinary.js';
import { getSetting, addCallback } from 'meteor/vulcan:core';
import { addCustomFields } from '../modules/index.js';

const cloudinarySettings = getSetting('cloudinary');

export const CloudinaryCollections = [];

export const makeCloudinary = ({collection, fieldName}) => {

  addCustomFields(collection);

  // post submit callback
  function cacheImageOnNew (document) {
    if (cloudinarySettings) {
      if (document[fieldName]) {

        const data = CloudinaryUtils.uploadImage(document[fieldName]);
        if (data) {
          document.cloudinaryId = data.cloudinaryId;
          document.cloudinaryUrls = data.urls;
        }

      }
    }
    return document;
  }
  addCallback(`${collection.options.collectionName.toLowerCase()}.new.sync`, cacheImageOnNew);

  function cacheImageOnEdit (modifier, oldDocument) {
    if (cloudinarySettings) {
      if (modifier.$set[fieldName] && modifier.$set[fieldName] !== oldDocument[fieldName]) {
        const data = CloudinaryUtils.uploadImage(modifier.$set[fieldName]);
        modifier.$set.cloudinaryId = data.cloudinaryId;
        modifier.$set.cloudinaryUrls = data.urls;
      }
    }
    return modifier;
  }
  addCallback(`${collection.options.collectionName.toLowerCase()}.edit.sync`, cacheImageOnEdit);

};