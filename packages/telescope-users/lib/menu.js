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
      return FlowRouter.path('userProfile', {_idOrSlug: user && user.telescope && user.telescope.slug});
    },
    label: function () { return i18n.t('profile'); },
    description: 'view_your_profile'
  },
  {
    route: function () {
      var user = Meteor.user();
      return FlowRouter.path('userEdit', {_idOrSlug: user && user.telescope && user.telescope.slug});
    },
    label: function () { return i18n.t('edit_account'); },
    description: 'edit_your_profile'
  },
  {
    route: 'adminSettings',
    label: function () { return i18n.t('settings'); },
    description: 'settings',
    adminOnly: true
  },
  {
    route: 'signOut',
    label: function () { return i18n.t('sign_out'); },
    description: 'sign_out'
  }
]);

// array containing items in the admin menu
Telescope.menuItems.add("adminMenu", [
  {
    route: 'adminUsers',
    label: function () { return i18n.t('users'); },
    description: 'users_dashboard'
  }
]);