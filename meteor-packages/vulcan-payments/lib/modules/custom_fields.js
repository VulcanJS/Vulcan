import Users from 'meteor/vulcan:users';

Users.addField([
  {
    fieldName: 'stripeCustomerId',
    fieldSchema: {
      type: String,
      optional: true,
    },
  },
]);
