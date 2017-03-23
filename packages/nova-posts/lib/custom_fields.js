import Users from "meteor/vulcan:users";

Users.addField([
  /**
    Count of the user's posts
  */
  {
    fieldName: "postCount",
    fieldSchema: {
      type: Number,
      optional: true,
      defaultValue: 0,
      viewableBy: ['guests'],
    }
  }
]);
