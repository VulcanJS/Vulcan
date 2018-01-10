/*

modules/movies/schema.js - #tutorial-step-10 -
This is a JS object that defines every property of a collection document...

A SimpleSchema-compatible JSON schema

*/

const schema = {
  // default properties

  _id: {
    type: String,
    optional: true,
    viewableBy: ["guests"]
  },
  createdAt: {
    type: Date,
    optional: true,
    viewableBy: ["guests"],
    onInsert: (document, currentUser) => {
      return new Date();
    }
  },
  userId: {
    type: String,
    optional: true,
    viewableBy: ["guests"],
    resolveAs: {
      fieldName: "user",
      type: "User",
      resolver: (movie, args, context) => {
        return context.Users.findOne(
          { _id: movie.userId },
          { fields: context.Users.getViewableFields(context.currentUser, context.Users) }
        );
      },
      addOriginalField: true
    }
  },

  // custom properties

  name: {
    label: "Name",
    type: String,
    optional: true,
    // ...these next three are interesting—they take a user group that says which group can do what action.
    // ...guests are anonymous users...
    viewableBy: ["guests"],
    /// ...members can only edit documents that they own. This is part of the default mutations. Back to modules/movies/collection.js...
    insertableBy: ["members"],
    editableBy: ["members"]
  },
  year: {
    label: "Year",
    type: String,
    optional: true,
    viewableBy: ["guests"],
    insertableBy: ["members"],
    editableBy: ["members"]
  },
  review: {
    label: "Review",
    type: String,
    optional: true,
    control: "textarea",
    viewableBy: ["guests"],
    insertableBy: ["members"],
    editableBy: ["members"]
  }
};

export default schema;
