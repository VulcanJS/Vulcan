Package.describe("Telescope base package");

Package.on_use(function (api) {

  api.use(['telescope-lib'], ['client', 'server']);

  api.add_files(['lib/base.js'], ['client', 'server']);
  api.add_files(['lib/base_client.js'], ['client']);
  api.add_files(['lib/base_server.js'], ['server']);

  api.export(['adminNav', 'viewNav', 'addToPostSchema', 'preloadSubscriptions', 'navItems', 'viewParameters']);
});