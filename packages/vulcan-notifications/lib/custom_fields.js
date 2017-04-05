import Users from 'meteor/vulcan:users';

// note: leverage weak dependencies on packages
const Comments = Package['vulcan:comments'] ? Package['vulcan:comments'].default : null;

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
      defaultValue: false,
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
      defaultValue: false,
      control: "checkbox",
      viewableBy: ['guests'],
      insertableBy: ['members'],
      editableBy: ['members'],
      group: notificationsGroup,
    }
  }
]);

if (!!Comments) {
  Users.addField([
    {
      fieldName: 'notifications_comments',
      fieldSchema: {
        label: 'Comments on my posts',
        type: Boolean,
        optional: true,
        defaultValue: false,
        control: "checkbox",
        viewableBy: ['guests'],
        insertableBy: ['members'],
        editableBy: ['members'],
        group: notificationsGroup,
      }
    },
    {
      fieldName: 'notifications_replies',
      fieldSchema: {
        label: 'Replies to my comments',
        type: Boolean,
        optional: true,
        defaultValue: false,
        control: "checkbox",
        viewableBy: ['guests'],
        insertableBy: ['members'],
        editableBy: ['members'],
        group: notificationsGroup,
      }
    }
  ]);  
}
