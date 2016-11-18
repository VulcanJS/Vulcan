import Telescope from 'meteor/nova:lib';
import Posts from "meteor/nova:posts";
import PublicationUtils from 'meteor/utilities:smart-publications';

Posts.addField([
  {
    fieldName: 'cloudinaryId',
    fieldSchema: {
      type: String,
      optional: true
    }
  },
  {
    fieldName: 'cloudinaryUrls',
    fieldSchema: {
      type: [Object],
      optional: true,
      blackbox: true
    }
  }
]);

if (typeof Settings !== "undefined") {
  Telescope.settings.collection.addField([
    {
      fieldName: 'cloudinaryCloudName',
      fieldSchema: {
        type: String,
        optional: true,
        form: {
          group: 'cloudinary'
        }
      }
    },
    {
      fieldName: 'cloudinaryAPIKey',
      fieldSchema: {
        type: String,
        optional: true,
        private: true,
        form: {
          group: 'cloudinary',
          class: 'private-field'
        }
      }
    },
    {
      fieldName: 'cloudinaryAPISecret',
      fieldSchema: {
        type: String,
        optional: true,
        private: true,
        form: {
          group: 'cloudinary',
          class: 'private-field'
        }
      }
    }
  ]);
}

PublicationUtils.addToFields(Posts.publishedFields.list, ["cloudinaryId", "cloudinaryUrls"]);
