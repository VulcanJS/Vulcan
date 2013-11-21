Package.describe("Telescope i18n package");

Package.on_use(function (api) {
	api.use(['handlebars'], 'client');
  api.add_files(['i18n.js'], ['client', 'server']);
	api.export('i18n');
});