Telescope.modules.add("secondaryNav", [
  {
    template: 'user_menu',
    order: 10
  }
]);

Telescope.modules.add("mobileNav", [
  {
    template: 'user_menu',
    order: 20
  }
]);

Telescope.menuItems.add("userMenu", [
  {
    route: function () {
      var user = Meteor.user();
      return Router.path('user_profile', {_idOrSlug: user && user.telescope && user.telescope.slug});
    },
    label: 'profile',
    description: 'view_your_profile'
  },
  {
    route: function () {
      var user = Meteor.user();
      return Router.path('user_edit', {slug: user && user.telescope && user.telescope.slug});
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