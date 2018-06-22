import Users from 'meteor/vulcan:users';

Users.addField([
  {
    fieldName: 'newsletter_subscribeToNewsletter',
    fieldSchema: {
      label: 'Subscribe to Newsletter',
      type: Boolean,
      optional: true,
      defaultValue: false,
      canCreate: ['members'],
      editableBy: ['members'],
      canRead: ['guests'],
      control: 'NewsletterSubscribe',
      group: {
        name: "newsletter",
        label: "Newsletter",
        order: 3
      },
    }
  },
]);
