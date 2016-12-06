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
      viewableBy: ['guests'],
      insertableBy: ['admins'],
      editableBy: ['admins'],
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
      viewableBy: ['guests'],
      insertableBy: ['members'],
      editableBy: ['members'],
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
        viewableBy: ['guests'],
        insertableBy: ['members'],
        editableBy: ['members']
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
        viewableBy: ['guests'],
        insertableBy: ['members'],
        editableBy: ['members']
      }
    }
  ]);  
}
