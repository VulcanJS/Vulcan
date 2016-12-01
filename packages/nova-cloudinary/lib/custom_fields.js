import Posts from "meteor/nova:posts";

Posts.addField([
  {
    fieldName: 'cloudinaryId',
    fieldSchema: {
      type: String,
      optional: true,
      viewableIf: ['anonymous'],
    }
  },
  {
    fieldName: 'cloudinaryUrls',
    fieldSchema: {
      type: [Object],
      optional: true,
      blackbox: true,
      viewableIf: ['anonymous'],
    }
  }
]);
