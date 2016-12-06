import Posts from "meteor/nova:posts";

Posts.addField([
  {
    fieldName: 'cloudinaryId',
    fieldSchema: {
      type: String,
      optional: true,
      viewableBy: ['guests'],
    }
  },
  {
    fieldName: 'cloudinaryUrls',
    fieldSchema: {
      type: [Object],
      optional: true,
      blackbox: true,
      viewableBy: ['guests'],
    }
  }
]);
