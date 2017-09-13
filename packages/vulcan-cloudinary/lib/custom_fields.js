import { Posts } from 'meteor/example-forum';

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
      optional: true,
      viewableBy: ['guests'],
    }
  },
  {
    fieldName: 'cloudinaryUrls.$',
    fieldSchema: {
      type: Object,
      blackbox: true,
      optional: true
    }
  }
]);
