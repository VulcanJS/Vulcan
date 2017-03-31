import Users from 'meteor/vulcan:users';

const notificationsGroup = {
  name: "notifications",
  order: 2
};

// Add notifications options to user profile settings
Users.addField([
  {
    fieldName: 'notifications_users',
    fieldSchema: {
      label: 'New users',
      type: Boolean,
      optional: true,
      control: "checkbox",
      viewableBy: ['guests'],
      insertableBy: ['admins'],
      editableBy: ['admins'],
      group: notificationsGroup,
    }
  },
  {
    fieldName: 'notifications_posts',
    fieldSchema: {
      label: 'New posts',
      type: Boolean,
      optional: true,
      control: "checkbox",
      viewableBy: ['guests'],
      insertableBy: ['members'],
      editableBy: ['members'],
      group: notificationsGroup,
    }
  }
]);

Users.addField([
  {
    fieldName: 'auto_subscribe_to_my_posts',
    fieldSchema: {
      label: 'Automatically subscribe to my posts (to be notified of comments)',
      type: Boolean,
      optional: true,
      control: "checkbox",
      viewableBy: ['guests'],
      insertableBy: ['members'],
      editableBy: ['members'],
      group: notificationsGroup,
    }
  },
  {
    fieldName: 'auto_subscribe_to_my_comments',
    fieldSchema: {
      label: 'Automatically subscribe to my comments (to be notified of replies)',
      type: Boolean,
      optional: true,
      control: "checkbox",
      viewableBy: ['guests'],
      insertableBy: ['members'],
      editableBy: ['members'],
      group: notificationsGroup,
    }
  }
]);
