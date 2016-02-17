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
      public: true
    }
  }
]);

Posts.publicationFields.list.push("commentCount", "commenters");
Posts.publicationFields.single.push("commentCount", "commenters");
