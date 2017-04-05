import Posts from "meteor/vulcan:posts";
import Users from "meteor/vulcan:users";

Users.addField([
  /**
    Count of the user's comments
  */
  {
    fieldName: "commentCount",
    fieldSchema: {
      type: Number,
      optional: true,
      defaultValue: 0,
      viewableBy: ['guests'],
    }
  }
]);

Posts.addField([
  /**
    Count of the post's comments
  */
  {
    fieldName: "commentCount",
    fieldSchema: {
      type: Number,
      optional: true,
      defaultValue: 0,
      viewableBy: ['guests'],
    }
  },
  /**
    An array containing the `_id`s of commenters
  */
  {
    fieldName: "commenters",
    fieldSchema: {
      type: Array,
      optional: true,
      resolveAs: 'commenters: [User]',
      viewableBy: ['guests'],
    }
  },
  {
    fieldName: "commenters.$",
    fieldSchema: {
      type: String,
      optional: true
    }
  }
]);
