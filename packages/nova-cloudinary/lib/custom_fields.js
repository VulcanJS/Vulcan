import Posts from "meteor/nova:posts";

Posts.addField([
  {
    fieldName: 'originalThumbnailUrl',
    fieldSchema: {
      type: String,
      optional: true
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