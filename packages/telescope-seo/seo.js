// Add SEO settings.
addToSettingsSchema.push({
  propertyName: "seoMetaDescription",
  propertySchema: {
    type: String,
    optional: true,
    label: "meta description",
    autoform: {
      group: "search engine optimization",
      instructions: "Content for the meta description tag for the front page and others that don't otherwise specify it.",
      rows: 2
    }
  }
});
addToSettingsSchema.push({
  propertyName: "seoOgDescription",
  propertySchema: {
    type: String,
    optional: true,
    label: "og:description",
    autoform: {
      group: "search engine optimization",
      instructions: "Content for the open graph description tag for the front page and others that don't otherwise specify it.",
      rows: 2
    }
  }
});
addToSettingsSchema.push({
  propertyName: "seoOgImage",
  propertySchema: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
    label: "og:image",
    autoform: {
      group: "search engine optimization",
      instructions: "URL to an image for the open graph image tag for all pages"
    }
  }
});
addToSettingsSchema.push({
  propertyName: "seoGenerateSitemap",
  propertySchema: {
    type: Boolean,
    defaultValue: false,
    label: "Generate sitemap",
    autoform: {
      group: "search engine optimization",
      instructions: "Automatically generate an XML sitemap for search engines, and append the sitemap URL to the output of robots.txt?  NOTE: Requires restart to reflect change."
    }
  }
})

if (Meteor.isClient) {
  Meteor.startup(function() {
    /*
     * Meta tags
     */

    // Post pages
    Router.onAfterAction(function() {
      var post = Posts.findOne(this.params._id);
      if (!post) {
        return;
      }
      var title = (typeof this.getTitle === 'function') ? this.getTitle() : post.title;
      if (post.categories && post.categories.length > 0) {
        title += " - " + _.pluck(post.categories, "name").join(", ");
      }
      var stitle = getSetting("title");
      if (stitle) {
        title += " - " + stitle;
      }
      var description = [getSetting("tagline"), post.title].join(" ");
      SEO.set({
        link: { canonical: getPostPageUrl(post) },
        meta: { description: description },
        og: {
          title: title,
          description: description,
          image: getSetting("seoOgImage")
        }
      });
    }, {only: ["post_page", "post_page_with_slug"]});

    // User pages
    Router.onAfterAction(function() {
      var user = Meteor.users.findOne(this.params._idOrSlug);
      if (user) {
        var title;
        if (typeof this.getTitle === 'function') {
          title = this.getTitle();
        } else {
          title = getUserName(user) + " - " + getSetting("title", "");
        }
        var description = "User profile for " + getUserName(user) + " - " + getSetting("title");
        SEO.set({
          link: { canonical: getSiteUrl() + "users/" + user._id },
          meta: { description: description },
          og: {
            title: title,
            description: description,
            image: getSetting("seoOgImage")
          }
        });
      }
    }, {only: ["user_profile"]});

    // All other pages
    Router.onAfterAction(function() {
      var title;
      if (typeof this.getTitle === 'function') {
        title = this.getTitle();
      } else {
        var stitle = getSetting("title");
        var stagline = getSetting("tagline");
        title = (stagline ? stitle + ": " + stagline : stitle) || "";
      }
      SEO.set({
        meta: {description: getSetting("seoMetaDescription")},
        og: {
          title: title,
          description: getSetting("seoOgDescription"),
          image: getSetting("seoOgImage")
        }
      });
    }, {except: ["user_profile", "post_page", "post_page_with_slug"]});
  });
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    /*
     * Sitemap
     */
    if (getSetting("seoGenerateSitemap")) {
      sitemaps.add("/sitemap.xml", function() {
        var _getLatest = function(viewParamKey, terms) {
          var params = getPostsParameters(
            viewParameters[viewParamKey.toLowerCase()](terms)
          );
          var post = Posts.findOne(params.find, {
            'fields': {'postedAt': 1},
            'sort': params.options.sort
          });
          return post ? post.postedAt : null;
        }
        // Posts list pages
        var paths = [
          {page: "/", lastmod: _getLatest(getSetting("defaultView", "top")), changefreq: "hourly"},
          {page: "/top", lastmod: _getLatest("top"), changefreq: "hourly"},
          {page: "/new", lastmod: _getLatest("new"), changefreq: "hourly"},
          {page: "/best", lastmod: _getLatest("best"), changefreq: "daily"},
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
              })
            }
          });
        }
        // Individual post pages: include 100 latest in each of "top", "new", and
        // "best". Aggregate them to avoid duplication.
        var postPages = {};
        _.each(["top", "new", "best"], function(key) {
          var siteUrl = getSiteUrl();
          var params = getPostsParameters(viewParameters[key]());
          var posts = Posts.find(params.find, {
            fields: {postedAt: 1, title: 1, _id: 1},
            limit: 100,
            sort: params.options.sort
          });
          posts.forEach(function(post) {
            var url = getPostPageUrl(post).replace(siteUrl, "");
            postPages[url] = {page: url, lastmod: post.postedAt, changefreq: "daily"};
          });
        });
        paths = paths.concat(_.values(postPages));
        paths = _.reject(paths, function(p) { return p.lastmod === null });
        return paths;
      });
    }
  });
}
