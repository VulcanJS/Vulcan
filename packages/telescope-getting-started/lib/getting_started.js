addToPostSchema.push(
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

addToPostSchema.push(
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