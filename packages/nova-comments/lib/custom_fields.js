import Posts from "meteor/nova:posts";
import Users from "meteor/nova:users";

const alwaysPublic = user => true;

Users.addField([
  /**
    Count of the user's comments
  */
  {
    fieldName: "nova_commentCount",
    fieldSchema: {
      type: Number,
      optional: true,
      publish: true,
      defaultValue: 0,
      viewableIf: alwaysPublic,
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
      viewableIf: alwaysPublic,
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
      },
      resolveAs: 'commenters: [User]',
      viewableIf: alwaysPublic,
    }
  }
]);
