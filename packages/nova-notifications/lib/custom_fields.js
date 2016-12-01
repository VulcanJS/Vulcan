import Users from 'meteor/nova:users';

const notificationsGroup = {
  name: "notifications",
  order: 2
};

// Add notifications options to user profile settings
Users.addField([
  {
    fieldName: '__notifications_users',
    fieldSchema: {
      label: 'New users',
      type: Boolean,
      optional: true,
      defaultValue: false,
      control: "checkbox",
      viewableIf: ['anonymous'],
      insertableIf: ['admins'],
      editableIf: ['admins'],
      group: notificationsGroup
    }
  },
  {
    fieldName: '__notifications_posts',
    fieldSchema: {
      label: 'New posts',
      type: Boolean,
      optional: true,
      defaultValue: false,
      control: "checkbox",
      viewableIf: ['anonymous'],
      insertableIf: ['default'],
      editableIf: ['default'],
      group: notificationsGroup
    }
  }
]);

if (typeof Comments !== "undefined") {
  Users.addField([
    {
      fieldName: '__notifications_comments',
      fieldSchema: {
        label: 'Comments on my posts',
        type: Boolean,
        optional: true,
        defaultValue: true,
        control: "checkbox",
        viewableIf: ['anonymous'],
        insertableIf: ['default'],
        editableIf: ['default']
      }
    },
    {
      fieldName: '__notifications_replies',
      fieldSchema: {
        label: 'Replies to my comments',
        type: Boolean,
        optional: true,
        defaultValue: true,
        control: "checkbox",
        viewableIf: ['anonymous'],
        insertableIf: ['default'],
        editableIf: ['default']
      }
    }
  ]);  
}
