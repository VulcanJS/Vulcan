Package.describe({summary: "Telescope photo module package"});

Package.on_use(function(api){
	
	api.use(['telescope-lib', 'telescope-base', 'tap:i18n'], ['client', 'server']);

	api.use(['http'], ['server']);

	api.use(['templating'], ['client']);

	api.add_files(['lib/photo.js'],['client', 'server']);

	api.add_files(['lib/server/get_photo.js'], ['server']);

	api.add_files(['lib/client/post_photo.html', 'lib/client/post_photo.css'], ['client']);

});