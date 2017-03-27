import Posts from "meteor/vulcan:posts";

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
      type: Array,
      blackbox: true,
      optional: true,
      viewableBy: ['guests'],
      resolveAs: 'cloudinaryUrls: [JSON]',
    }
  },
  {
    fieldName: 'cloudinaryUrls.$',
    fieldSchema: {
      type: Object,
      optional: true
    }
  }
]);
