// array containing nav items;

Telescope.modules.add("secondaryNav", [
  {
    template: 'user_menu',
    order: 10
  },
  {
    template: 'submit_button',
    order: 30
  }
]);

Telescope.modules.add("mobileNav", [
  {
    template: 'user_menu',
    order: 20
  },
  {
    template: 'submit_button',
    order: 30
  }
]);

Telescope.modules.add("footer", [
  {
    template: 'footer_code',
    order: 10
  }
]);