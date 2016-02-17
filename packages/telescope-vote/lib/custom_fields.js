Telescope.settings.addField([
  /**
    How many upvotes the post has received
  */
  {
    fieldName: "upvotes",
    fieldSchema: {
      type: Number,
      optional: true
    }
  },
  /**
    An array containing the `_id`s of the post's upvoters
  */
  {
    fieldName: "upvoters",
    fieldSchema: {
      type: [String],
      optional: true
    }
  },
  /**
    How many downvotes the post has received
  */
  {
    fieldName: "downvotes",
    fieldSchema: {
    type: Number,
    optional: true
    }
  },
  /**
    An array containing the `_id`s of the post's downvoters
  */
  {
    fieldName: "downvoters",
    fieldSchema: {
      type: [String],
      optional: true
    }
  },
]);

Posts.publicationFields.list.push("upvotes", "downvotes");
Posts.publicationFields.single.push("upvotes", "upvoters", "downvotes", "downvoters");
