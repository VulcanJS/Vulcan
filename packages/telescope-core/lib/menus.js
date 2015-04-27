////////////////
// Navigation //
////////////////



// array containing items in the views menu
Telescope.menus.register("viewsMenu", [
  {
    route: 'posts_top',
    label: 'top',
    description: 'most_popular_posts'
  },
  {
    route: 'posts_new',
    label: 'new',
    description: 'newest_posts'
  },
  {
    route: 'posts_best',
    label: 'best',
    description: 'highest_ranked_posts_ever'
  },
  {
    route: 'posts_pending',
    label: 'pending',
    description: 'posts_awaiting_moderation',
    adminOnly: true
  },
  {
    route: 'posts_scheduled',
    label: 'scheduled',
    description: 'future_scheduled_posts',
    adminOnly: true
  },
]);

// array containing items in the admin menu
Telescope.menus.register("adminMenu", [
  {
    route: 'settings',
    label: 'settings',
    description: 'telescope_settings_panel'
  },
  {
    route: 'usersDashboard',
    label: 'users',
    description: 'users_dashboard'
  }
]);

Telescope.menus.register("userMenu", [
  {
    route: function () {
      return Router.path('user_profile', {_idOrSlug: Meteor.user().slug});
    },
    label: 'profile',
    description: 'view_your_profile'
  },
  {
    route: function () {
      return Router.path('user_edit', {slug: Meteor.user().slug});
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