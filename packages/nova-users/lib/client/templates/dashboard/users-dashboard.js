Template.users_dashboard.helpers({
  settings: function() {
    return {
      collection: 'all-users',
      rowsPerPage: 20,
      showFilter: true,
      fields: [
        { key: 'avatar', label: '', tmpl: Template.users_list_avatar, sortable: false },
        { key: 'createdAt', label: 'Member Since', tmpl: Template.users_list_created_at, sort: 'descending' },
        { key: 'isAdmin', label: 'Admin', fn: function(val){return val ? 'Yes':'No'} },
        { key: 'username', label: 'Username', tmpl: Template.users_list_username },
        { key: 'telescope.displayName', label: 'Display Name', tmpl: Template.users_list_display_name },
        { key: 'telescope.email', label: 'Email', tmpl: Template.users_list_email },
        { key: 'telescope.postCount', label: 'Posts' },
        { key: 'telescope.commentCount', label: 'Comments' },
        { key: 'telescope.karma', label: 'Karma', fn: function(val){return Math.round(100*val)/100} },
        { key: 'telescope.inviteCount', label: 'Invites' },
        { key: 'telescope.isInvited', label: 'Invited', fn: function(val){return val ? 'Yes':'No'} },
        { key: 'actions', label: 'Actions', tmpl: Template.users_list_actions, sortable: false }
      ]
    };
  }
});
