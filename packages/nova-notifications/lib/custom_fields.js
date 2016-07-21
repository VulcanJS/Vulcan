import Users from 'meteor/nova:users';

const notificationsGroup = {
  name: "notifications",
  order: 2
};

// check if user can create a new account
const canInsert = user => Users.canDo(user, "users.new");
// check if user can edit a user
const canEdit = Users.canEdit;

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
      insertableIf: Users.isAdmin,
      editableIf: Users.isAdmin,
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
      insertableIf: canInsert,
      editableIf: canEdit,
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
        insertableIf: canInsert,
        editableIf: canEdit
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
        insertableIf: canInsert,
        editableIf: canEdit
      }
    }
  ]);  
}
