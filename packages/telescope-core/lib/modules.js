// array containing nav items;

Telescope.modules.register("secondaryNav", [
  {
    template: 'userMenu',
    order: 10
  },
  {
    template:'notificationsMenu',
    order: 20
  },
  {
    template: 'submitButton',
    order: 30
  }
]);

Telescope.modules.register("mobileNav", [
  {
    template: 'userMenu',
    order: 10
  },
  {
    template:'notificationsMenu',
    order: 20
  },
  {
    template: 'submitButton',
    order: 30
  }
]);