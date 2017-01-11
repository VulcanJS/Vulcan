import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";

Users.addField([
  /**
    Count of the user's comments
  */
  {
    fieldName: "__commentCount",
    fieldSchema: {
      type: Number,
      optional: true,
      publish: true,
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
      publish: true,
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
      publish: true,
      // join: {
      //   joinAs: "commentersArray",
      //   collection: () => Users,
      //   limit: 4
      // },
      resolveAs: 'commenters: [User]',
      viewableBy: ['guests'],
    }
  },
  {
    fieldName: "commenters.$",
    fieldSchema: {
      type: String,
      optional: true,
    },
  },
]);
