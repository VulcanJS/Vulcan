import Users from 'meteor/nova:users';

const notificationsGroup = {
  name: "notifications",
  order: 2
};

// Add notifications options to user profile settings
Users.addField([
  {
    fieldName: 'telescope.notifications_users',
    fieldSchema: {
      label: 'New users',
      type: Boolean,
      optional: true,
      defaultValue: false,
      control: "checkbox",
      insertableIf: Users.is.admin,
      editableIf: Users.is.admin,
      group: notificationsGroup
    }
  },
  {
    fieldName: 'telescope.notifications_posts',
    fieldSchema: {
      label: 'New posts',
      type: Boolean,
      optional: true,
      defaultValue: false,
      control: "checkbox",
      insertableIf: Users.is.memberOrAdmin,
      editableIf: Users.is.ownerOrAdmin,
      group: notificationsGroup
    }
  }
]);

if (typeof Comments !== "undefined") {
  Users.addField([
    {
      fieldName: 'telescope.notifications_comments',
      fieldSchema: {
        label: 'Comments on my posts',
        type: Boolean,
        optional: true,
        defaultValue: true,
        control: "checkbox",
        insertableIf: Users.is.memberOrAdmin,
        editableIf: Users.is.ownerOrAdmin
      }
    },
    {
      fieldName: 'telescope.notifications_replies',
      fieldSchema: {
        label: 'Replies to my comments',
        type: Boolean,
        optional: true,
        defaultValue: true,
        control: "checkbox",
        insertableIf: Users.is.memberOrAdmin,
        editableIf: Users.is.ownerOrAdmin
      }
    }
  ]);  
}
