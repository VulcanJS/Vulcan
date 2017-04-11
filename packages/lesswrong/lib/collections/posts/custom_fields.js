import Posts from "meteor/vulcan:posts";

Posts.addField([
  /**
    Drafts
  */
  {
    fieldName: "draft",
    fieldSchema: {
      type: Boolean,
      optional: true,
      defaultValue: false,
      viewableBy: ['members'],
      insertableBy: ['members'],
      editableBy: ['members'],
      control: "checkbox"
    }
  }
]);
