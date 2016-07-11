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
  Settings.addField([
    {
      fieldName: 'cloudinaryCloudName',
      fieldSchema: {
        type: String,
        optional: true,
        autoform: {
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
        autoform: {
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
        autoform: {
          group: 'cloudinary',
          class: 'private-field'
        }
      }
    }
  ]);
}

PublicationUtils.addToFields(Posts.publishedFields.list, ["cloudinaryId", "cloudinaryUrls"]);
