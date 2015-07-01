Settings.addField({
  fieldName: 'emailNotifications',
  fieldSchema: {
    type: Boolean,
    optional: true,
    defaultValue: true,
    autoform: {
      group: 'notifications',
      instructions: 'Enable email notifications for new posts and new comments (requires restart).'
    }
  }
});

// make it possible to disable notifications on a per-comment basis
Comments.addField(
  {
    fieldName: 'disableNotifications',
    fieldSchema: {
      type: Boolean,
      optional: true,
      autoform: {
        omit: true
      }
    }
  }
);

// Add notifications options to user profile settings
Users.addField([
  {
    fieldName: 'telescope.notifications.users',
    fieldSchema: {
      label: 'New users',
      type: Boolean,
      optional: true,
      defaultValue: false,
      editableBy: ['admin'],
      autoform: {
        group: 'Email Notifications'
      }
    }
  },
  {
    fieldName: 'telescope.notifications.posts',
    fieldSchema: {
      label: 'New posts',
      type: Boolean,
      optional: true,
      defaultValue: false,
      editableBy: ['admin', 'member'],
      autoform: {
        group: 'Email Notifications'
      }
    }
  },
  {
    fieldName: 'telescope.notifications.comments',
    fieldSchema: {
      label: 'Comments on my posts',
      type: Boolean,
      optional: true,
      defaultValue: true,
      editableBy: ['admin', 'member'],
      autoform: {
        group: 'Email Notifications'
      }
    }
  },
  {
    fieldName: 'telescope.notifications.replies',
    fieldSchema: {
      label: 'Replies to my comments',
      type: Boolean,
      optional: true,
      defaultValue: true,
      editableBy: ['admin', 'member'],
      autoform: {
        group: 'Email Notifications'
      }
    }
  }
]);
