Telescope.menuItems.add("adminMenu", [
  {
    route: 'adminSettings',
    label: _.partial(i18n.t, 'settings'),
    description: _.partial(i18n.t, 'telescope_settings_panel')
  }
]);