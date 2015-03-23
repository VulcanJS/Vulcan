Template[getTemplate('usersDashboard')].helpers({
  settings: function() {
    return {
      collection: 'all-users',
      rowsPerPage: 20,
      showFilter: true,
      fields: [
        { key: 'avatar', label: '', tmpl: Template.users_list_avatar, sortable: false },
        { key: 'username', label: 'Username', tmpl: Template.users_list_username },
        { key: 'profile.username', label: 'Display Name' },
        { key: 'profile.email', label: 'Email', tmpl: Template.users_list_email },
        { key: 'createdAt', label: 'Member Since', tmpl: Template.users_list_created_at, sort: 'descending' },
        { key: 'postCount', label: 'Posts' },
        { key: 'commentCount', label: 'Comments' },
        { key: 'karma', label: 'Karma', fn: function(val){return Math.round(100*val)/100} },
        { key: 'inviteCount', label: 'Invites' },
        { key: 'isInvited', label: 'Invited', fn: function(val){return val ? 'Yes':'No'} },
        { key: 'isAdmin', label: 'Admin', fn: function(val){return val ? 'Yes':'No'} },
        { key: 'actions', label: 'Actions', tmpl: Template.users_list_actions, sortable: false }
      ]
    };
  }
});
