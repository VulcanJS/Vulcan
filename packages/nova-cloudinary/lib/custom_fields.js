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
      blackbox: true,
      optional: true,
      viewableBy: ['guests'],
      resolveAs: 'cloudinaryUrls: [JSON]',
    }
  }
]);
