Posts.addToSchema(
  {
    propertyName: 'dummySlug',
    propertySchema: {
      type: String,
      optional: true,
      autoform: {
        omit: true
      }
    }
  }
);

Posts.addToSchema(
  {
    propertyName: 'isDummy',
    propertySchema: {
      type: Boolean,
      optional: true,
      autoform: {
        omit: true
      }
    }
  }
);

addToCommentsSchema.push(
  {
    propertyName: 'isDummy',
    propertySchema: {
      type: Boolean,
      optional: true,
      autoform: {
        omit: true
      }
    }
  }
);
