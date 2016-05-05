import PublicationsUtils from 'meteor/utilities:smart-publications';

// used to keep track of which feed a post was imported from
Posts.addField([
  {
    fieldName: 'feedId',
    fieldSchema: {
      type: String,
      label: 'feedId',
      optional: true,
      autoform: {
        omit: true
      }
    }
  },
// the RSS ID of the post in its original feed
  {
    fieldName: 'feedItemId',
    fieldSchema: {
      type: String,
      label: 'feedItemId',
      optional: true,
      autoform: {
        omit: true
      }
    }
  }
]);
PublicationsUtils.addToFields(Posts.publishedFields.list, ['feedId', 'feedItemId']);