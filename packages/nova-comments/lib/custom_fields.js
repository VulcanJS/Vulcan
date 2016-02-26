Posts.addField([
  /**
    Count of the post's comments
  */
  {
    fieldName: "commentCount",
    fieldSchema: {
      type: Number,
      optional: true,
      public: true
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
      public: true,
      join: {
        joinAs: "commentersArray",
        collection: () => Users,
        limit: 4
      }
    }
  }
]);

Telescope.utils.addToFields(Posts.publishedFields.list, ["commentCount", "commenters"]);
Telescope.utils.addToFields(Posts.publishedFields.single, ["commentCount", "commenters"]);
