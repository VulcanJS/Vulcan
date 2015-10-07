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

var userMenuItems = [
  {
    route: function () {
      var user = Meteor.user();
      return FlowRouter.path('userProfile', {_idOrSlug: user && user.telescope && user.telescope.slug});
    },
    label: 'profile',
    description: 'view_your_profile'
  },
  {
    route: function () {
      var user = Meteor.user();
      return FlowRouter.path('userEdit', {_idOrSlug: user && user.telescope && user.telescope.slug});
    },
    label: 'edit_account',
    description: 'edit_your_profile'
  },
  {
    route: 'adminSettings',
    label: 'settings',
    description: 'settings',
    adminOnly: true
  },
  {
    route: 'signOut',
    label: 'sign_out',
    description: 'sign_out'
  }
]

// add label & description i18n functions
userMenuItems = userMenuItems.map(function (item) {
  item.label = _.partial(i18n.t, item.label);
  item.description = _.partial(i18n.t, item.description);
  return item;
});

Telescope.menuItems.add("userMenu", userMenuItems);

// array containing items in the admin menu
Telescope.menuItems.add("adminMenu", [
  {
    route: 'adminUsers',
    label: function () { return i18n.t('users'); },
    description: function () { return i18n.t('users_dashboard'); }
  }
]);