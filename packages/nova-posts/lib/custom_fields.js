import Posts from './collection.js';
import Users from "meteor/nova:users";

const alwaysPublic = user => true;

Users.addField([
  /**
    Count of the user's posts
  */
  {
    fieldName: "nova_postCount",
    fieldSchema: {
      type: Number,
      optional: true,
      publish: true,
      defaultValue: 0,
      viewableIf: alwaysPublic,
    }
  }
]);