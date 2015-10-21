Meteor.startup(function() {
  /*
   * Sitemap
   */
  sitemaps.add("/sitemap.xml", function() {
    var _getLatest = function(viewParamKey, terms) {
      var postView = Posts.views[viewParamKey.toLowerCase()];

      if (!_.isFunction(postView)) return null;

      var params = Posts.parameters.get(postView(terms));
      var post = Posts.findOne(params.find, {
        'fields': {'postedAt': 1},
        'sort': params.options.sort
      });
      return post ? post.postedAt : null;
    };

    // Posts list pages
    var paths = [
      {page: "/", lastmod: _getLatest(Settings.get("defaultView", "top")), changefreq: "hourly"},
      {page: "/top", lastmod: _getLatest("top"), changefreq: "hourly"},
      {page: "/new", lastmod: _getLatest("new"), changefreq: "hourly"},
      {page: "/best", lastmod: _getLatest("best"), changefreq: "daily"}
    ];

    // Categories (if telescope-tags is included)
    if (typeof Categories !== "undefined") {
      Categories.find({}, {fields: {"slug": 1}}).forEach(function(category) {
        var lastMod = _getLatest("category", {category: category.slug});
        if (lastMod) {
          paths.push({
            page: "/category/" + category.slug,
            lastmod: lastMod,
            changefreq: "hourly"
          });
        }
      });
    }

    // Individual post pages: include 100 latest in each of "top", "new", and
    // "best". Aggregate them to avoid duplication.
    var postPages = {};
    _.each(["top", "new", "best"], function(key) {
      var siteUrl = Telescope.utils.getSiteUrl();
      var params = Posts.parameters.get(Posts.views[key]());
      var posts = Posts.find(params.find, {
        fields: {postedAt: 1, slug: 1, _id: 1},
        limit: 100,
        sort: params.options.sort
      });
      posts.forEach(function(post) {
        postPages[post.url] = {page: post.getPageUrl(), lastmod: post.postedAt, changefreq: "daily"};
      });
    });

    paths = paths.concat(_.values(postPages));
    paths = _.reject(paths, function(p) { return p.lastmod === null; });
    return paths;
  });
});
