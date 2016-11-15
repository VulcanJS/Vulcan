import Posts from "meteor/nova:posts";

const alwaysPublic = user => true;

Posts.addField([
  {
    fieldName: 'cloudinaryId',
    fieldSchema: {
      type: String,
      optional: true,
      viewableIf: alwaysPublic,
    }
  },
  {
    fieldName: 'cloudinaryUrls',
    fieldSchema: {
      type: [Object],
      optional: true,
      blackbox: true,
      viewableIf: alwaysPublic,
    }
  }
]);
