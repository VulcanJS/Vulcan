Package.describe({
	summary: "Server-side rendering for Telescope (alpha)",
	version: "0.0.1"
});

Package.onUse(function(api) {
	api.versionsFrom("METEOR@1.0.3.2");
	//
	api.use("webapp","server");
	//
	api.use([
		"sacha:juice@0.1.2",
		"meteorhacks:ssr@2.1.1"
	],"server");
	// private
	api.addFiles([
		"private/views/common/css.html",
		"private/views/common/layout.html",
		"private/views/common/open-graph.html",
		"private/views/common/twitter-card.html",
		"private/views/nav/nav.html",
		"private/views/posts/modules/post-content.html",
		"private/views/posts/post-body.html",
		"private/views/posts/post-item.html",
		"private/views/posts/post-share-page.html",
		"private/views/main.html"
	], "server",{
		isAsset:true
	});
	// server
	api.addFiles([
		"server/lib/ssr.js",
		"server/views/common/css.js",
		"server/views/common/layout.js",
		"server/views/common/open-graph.js",
		"server/views/common/twitter-card.js",
		"server/views/nav/nav.js",
		"server/views/posts/modules/post-content.js",
		"server/views/posts/post-body.js",
		"server/views/posts/post-item.js",
		"server/views/posts/post-share-page.js",
		"server/views/main.js"
	], "server");
});
