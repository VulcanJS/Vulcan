Telescope.menuItems.add("userMenu", [
  {
    route: function () {
      return Router.path('user_profile', {_idOrSlug: Meteor.user().telescope.slug});
    },
    label: 'profile',
    description: 'view_your_profile'
  },
  {
    route: function () {
      return Router.path('user_edit', {slug: Meteor.user().telescope.slug});
    },
    label: 'edit_account',
    description: 'edit_your_profile'
  },
  {
    route: 'settings',
    label: 'settings',
    description: 'settings',
    adminOnly: true
  },
  {
    route: 'signOut',
    label: 'sign_out',
    description: 'sign_out'
  }
]);

// array containing items in the admin menu
Telescope.menuItems.add("adminMenu", [
  {
    route: 'users_dashboard',
    label: 'users',
    description: 'users_dashboard'
  }
]);