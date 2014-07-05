Package.describe({summary: "Telescope i18n package"});

Package.on_use(function (api) {
	api.use(['ui'], 'client');
  api.add_files(['i18n.js'], ['client', 'server']);
	api.export('i18n');
});