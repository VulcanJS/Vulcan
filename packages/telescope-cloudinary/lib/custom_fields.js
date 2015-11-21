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

Posts.addField([
  {
    fieldName: 'originalThumbnailUrl',
    fieldSchema: {
      type: String,
      optional: true
    }
  }
]);