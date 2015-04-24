Posts.registerField(
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

Posts.registerField(
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

Comments.registerField(
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
