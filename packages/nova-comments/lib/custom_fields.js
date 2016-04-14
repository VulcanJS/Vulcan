import PublicationUtils from 'meteor/utilities:smart-publications';

Posts.addField([
  /**
    Count of the post's comments
  */
  {
    fieldName: "commentCount",
    fieldSchema: {
      type: Number,
      optional: true,
      publish: true,
      defaultValue: 0
    }
  },
  /**
    An array containing the `_id`s of commenters
  */
  {
    fieldName: "commenters",
    fieldSchema: {
      type: [String],
      optional: true,
      publish: true,
      join: {
        joinAs: "commentersArray",
        collection: () => Users,
        limit: 4
      }
    }
  }
]);

PublicationUtils.addToFields(Posts.publishedFields.list, ["commentCount", "commenters"]);
